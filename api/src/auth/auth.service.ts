import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(dto: CreateUserDto) {
    const newUser = await this.usersService.create(dto);
    const userId = String(newUser._id);
    const tokens = await this.getTokens(userId, newUser.email);
    await this.updateRefreshTokenHash(userId, tokens.refresh_token);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      ...tokens,
    };
  }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new ForbiddenException('Erişim reddedildi.');

    const passwordMatches = await bcrypt.compare(pass, user.password);
    if (!passwordMatches) throw new ForbiddenException('Erişim reddedildi.');

    const userId = String(user._id);
    const tokens = await this.getTokens(userId, user.email);
    await this.updateRefreshTokenHash(userId, tokens.refresh_token);

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: null as any });
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Erişim reddedildi.');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Erişim reddedildi.');

    const uid = String(user._id);
    const tokens = await this.getTokens(uid, user.email);
    await this.updateRefreshTokenHash(uid, tokens.refresh_token);
    return tokens;
  }

  async getTokens(userId: string, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET') as string,
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET') as string,
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') as any,
        },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async updateRefreshTokenHash(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.usersService.update(userId, { refreshToken: hash });
  }
}

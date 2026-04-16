import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { AccessTokenGuard } from './guards/accesstoken.guard';
import { RefreshTokenGuard } from './guards/refreshtoken.guard';

interface JwtRequest extends Request {
  user: {
    sub: string;
    refreshToken?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@Req() req: JwtRequest) {
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: JwtRequest) {
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken as string);
  }
}

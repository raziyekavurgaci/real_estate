import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { AtGuard } from './guards/accesstoken.guard';
import { RtGuard } from './guards/refreshtoken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: SigninDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: any) {
    const user = req.user;
    return this.authService.logout(user.sub);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: any) {
    const user = req.user;
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}

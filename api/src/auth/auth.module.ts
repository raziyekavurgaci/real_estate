import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy } from './strategies/accesstoken.strategy';
import { RtStrategy } from './strategies/refreshtoken.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule, 
    JwtModule.register({}), 
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}

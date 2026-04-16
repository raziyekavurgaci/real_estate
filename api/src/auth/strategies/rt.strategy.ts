import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET') as string,
      passReqToCallback: true, // Refresh token'ı request gövdesinden almak için
    });
  }

  validate(req: Request, payload: any) {
    const authHeader = req.get('authorization');
    const refreshToken = authHeader ? authHeader.replace('Bearer', '').trim() : null;

    if (!refreshToken) throw new ForbiddenException('Refresh token bulunamadı');

    return {
      ...payload,
      refreshToken,
    };
  }
}

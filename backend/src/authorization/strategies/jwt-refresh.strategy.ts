import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
//import { extractRefreshTokenFromCookies } from '../../constants/cookies';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import {IUser} from '../../types/custom'
import { pay } from 'telegraf/typings/button';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService, authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => authService.extractRefreshTokenFromCookies(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: IUser) {
    if (!payload.id || !payload.name || payload.role_id == null ) {
      console.log('JwtRefreshStrategy payload',payload)
      throw new UnauthorizedException('Invalid refresh jwt payload.');
    }
    return payload;
  }
}

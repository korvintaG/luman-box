import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';  
import { AuthService } from './auth.service';
import { UsersModule } from '../DDD/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { ConfigService } from '@nestjs/config';
import {AuthController} from './auth.controller'
import {LoginRateLimiterService} from './LoginRateLimiterService'


@Module({
  imports: [UsersModule, PassportModule, 
    JwtModule.registerAsync({ 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('AUTH_ACCESS_TOKEN_EXPIRY') },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtRefreshStrategy, AccessTokenStrategy, LoginRateLimiterService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
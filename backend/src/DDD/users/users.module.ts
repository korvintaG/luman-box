import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {User} from './entities/user.entity'
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from '../../interceptors/current-user.interceptor';



@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, 
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
],
})
export class UsersModule {}

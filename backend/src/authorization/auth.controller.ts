import {
  InternalServerErrorException,
  Body,
  Get,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from '../DDD/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../DDD/users/dto/create-user.dto';
import { Response, Request } from 'express';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDto } from '../DDD/users/dto/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { RoleGuard } from './guards/role.guard';
import { WithRole } from './decorators/role.decorator';
import { Role } from '../types/custom';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  signin(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    //console.log('AuthController login origin host',req.get('origin'),req.get('host'))
    return this.authService.login(res, req.user);
  }

  @Post('logout')
  clearAuthCookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.authService.getCookieConfig().refreshToken.name);
    return { success: true };
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.SuperAdmin)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('token')
  refreshTokens(@Req() req: Request) {
    if (!req.user) {
      throw new InternalServerErrorException();
    }
    return this.authService.generateAccessToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  @Get('user')
  async getUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.header('Cache-Control', 'no-store');
    const user = await this.usersService.findOne(req.user.id);
    //console.log('getUser',user);
    return user;
  }
}

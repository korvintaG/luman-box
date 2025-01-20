import { InternalServerErrorException, Body, Get, Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from '../../DDD/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../local-auth.guard';
import { CreateUserDto } from '../../DDD/users/dto/create-user.dto';
import { Response, Request as Reqe } from 'express';
import { JwtRefreshAuthGuard } from '../jwt-refresh-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard'
import { UserDto } from '../../DDD/users/dto/user.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  signin(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(res, req.user);
  }

  @UseGuards(JwtRefreshAuthGuard) // нет смысла делать выход невошедши
  @Post('logout')
  clearAuthCookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.authService.cookieConfig().refreshToken.name);
    return {success: true}
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.register(res, createUserDto);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('token')
  refreshTokens(
    @Req() req: Reqe,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.user) {
      throw new InternalServerErrorException();
    }

    return this.authService.generateTokenPair(
      (req.user as any).attributes,
      res);
  }

  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  @Get('user')
  async getUser(
    @Req() req: Reqe,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.header('Cache-Control', 'no-store');
    const curUser=req.user as any
    return this.usersService.findOne(curUser.id);
  }


}
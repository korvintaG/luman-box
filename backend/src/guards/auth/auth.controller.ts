import { InternalServerErrorException, Body, Get, Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from '../../DDD/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../local-auth.guard';
import { CreateUserDto } from '../../DDD/users/dto/create-user.dto';
import { Response, Request as Reqe } from 'express';
import { JwtRefreshAuthGuard } from '../jwt-refresh-auth.guard';


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

  @Get('logout')
  clearAuthCookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.authService.cookieConfig().refreshToken.name);
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
}
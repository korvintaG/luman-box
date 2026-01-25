import {
  Body,
  Get,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  HttpCode,
  NotFoundException,
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
import { Role, StatusCode } from '../types/custom';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(StatusCode.successAuth)
  @ApiBody({ type: LoginDto, description: 'Данные для входа' })
  @ApiOkResponse({ description: 'Успешная авторизация', type: LoginResponseDto })
  signin(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(res, req.user);
  }

  @Post('logout')
  @HttpCode(StatusCode.successLogout)
  @ApiResponse({ status:StatusCode.successLogout, description: 'Успешный выход из системы', type: LogoutResponseDto })
  clearAuthCookie(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.authService.extractRefreshTokenFromCookies(req);
    
    if (!refreshToken) {
      throw new NotFoundException({
        error: 'NotFound',
        message: 'Refresh token не найден',
      });
    }
    
    // Если refreshToken есть, очищаем его
    res.clearCookie(this.authService.getCookieConfig().refreshToken.name);
    return { success: true };
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.SuperAdmin)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Get('token')
  @UseGuards(JwtRefreshAuthGuard)
  refreshTokens(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'Не удалось определить пользователя',
      });
    }
    return this.authService.generateAccessToken(req.user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async getUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.header('Cache-Control', 'no-store');
    const user = await this.usersService.findOne(req.user.id);
    console.log('getUser',user);
    return user;
  }
}

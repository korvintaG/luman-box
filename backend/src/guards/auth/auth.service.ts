import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../DDD/users/users.service';
import {User} from '../../DDD/users/entities/user.entity'
import {IUser} from '../../types/custom'
import {CreateUserDto} from '../../DDD/users/dto/create-user.dto'
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    ) {}

  async login(res: Response, user: IUser) {
      if (!user || !user.id) {
        throw new InternalServerErrorException('User not set in request');
      }
      const accessToken=await this.generateTokenPair(user, res);
      return {...accessToken, success: true, user};
  }
  
  // принимает в качестве входных данных имя пользователя и пароль и проверяет, существует ли пользователь и верен ли пароль
  // нужно для локальной стратегии
  async validateUser(name: string, password: string) {
    const [user] = await this.usersService.find(name); 
    if (!user) {
      return null;
    }
    const [salt, storedHash] = user.password.split('.');        
    const hash = await this.hashPasswordWithSalt(password, salt);
    if (storedHash === hash) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateRefreshToken(
    authUser: Partial<User>
  ) {
    return this.jwtService.sign(
      { id: authUser.id, name: authUser.name },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('AUTH_REFRESH_TOKEN_EXPIRY')
      },
    );
  }

  extractRefreshTokenFromCookies (req: Request)  {
    const cookies = req.headers.cookie?.split('; ');
    if (!cookies?.length) {
      return null;
    }
    const refreshTokenCookie = cookies.find((cookie) =>
      cookie.startsWith(`${this.getCookieConfig().refreshToken.name}=`),
    );
    if (!refreshTokenCookie) {
      return null;
    }
    return refreshTokenCookie.split('=')[1] as string;
  };
    
  getCookieConfig () {
    return {
    refreshToken: {
      name: 'refreshToken',
      options: {
        path: '/', 
        httpOnly: true,
        sameSite: 'strict' as 'strict',
        secure: true,
        maxAge: Number(ms(this.configService.get('AUTH_REFRESH_TOKEN_EXPIRY')))
      },
    },
    }
  };

  async generateAccessToken(user: Partial<User>) {
    const payload = { id: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload), // jwt module is configured in auth.module.ts for access token
      success: true
    };
  }

  async generateTokenPair(
    user: Partial<User>,
    res: Response
  ) {
    res.cookie(
      this.getCookieConfig().refreshToken.name,
      await this.generateRefreshToken(user),
      {...this.getCookieConfig().refreshToken.options},
    );
    return this.generateAccessToken(user)
  }

  async register(user: CreateUserDto) {
    const [existingUser] = await this.usersService.find(user.name);
    if (existingUser) {
      throw new BadRequestException('name already exists');
    }
    const salt = randomBytes(8).toString('hex');
    const hashedPassword = await this.hashPasswordWithSalt(user.password, salt);
    const newUser = { ...user, password: `${salt}.${hashedPassword}` };
    const retUser= await this.usersService.create(newUser);
    return {success: true};
  }

  private async hashPasswordWithSalt(password:string, salt:string):Promise<string> {
    return ((await scrypt(password, salt, 32)) as Buffer).toString('hex');
  }

}

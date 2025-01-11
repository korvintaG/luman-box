import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(name: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(name);
    if (users.length) {
      throw new BadRequestException('Указанное имя пользователя уже используется');
    }

    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create({name, password:result});

    // return the user
    return user;
  }

  async signin(name: string, password: string) { // логин
    const [user] = await this.usersService.find(name);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Пароль не верен');
    }

    return user;
  }


}

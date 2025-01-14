import { Controller, Get, Post, Body, Patch, Param, Delete, Session} from '@nestjs/common';
import { UsersService } from './users.service';
//import { AuthService } from '../../guards/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { User } from './entities/user.entity';


@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    //private readonly authService: AuthService
    ) {}

  /*@Get('/whoami')
  whoAmI(@Session() session: any) {
    return this.usersService.findOne(session.userId);
  }
  whoAmI(@CurrentUser() user: User) {
    return user;
  }*/

  
  /*@Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup') // регистрация 
  async signup(@Body() createUserDto: CreateUserDto, @Session() session: any) {
      const user = await this.authService.signup(createUserDto.name, createUserDto.password );
      session.userId = user.id;
      return user;
  }

  @Post('/signin') // логин
    async signin(@Body() createUserDto: CreateUserDto, @Session() session: any) {
      const user = await  this.authService.signin(createUserDto.name, createUserDto.password );
      session.userId = user.id;
      return user;
  }
*/
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

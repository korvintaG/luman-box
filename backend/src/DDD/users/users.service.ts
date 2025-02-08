import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { omit } from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    return omit(savedUser, ['password', 'id_out']);
  }

  findAll() {
    return `This action returns all users`;
  }

  find(name: string) {
    return name
      ? this.userRepository.find({
          where: { name },
          select: { id: true, name: true, password: true, role_id: true },
        })
      : null;
  }

  findOne(id: number) {
    return id ? this.userRepository.findOneBy({ id }) : null;
  }

  findOneByChatId(chat_id: string) {
    return chat_id ? this.userRepository.findOneBy({ chat_id }) : null;
  }

  findNameCaseInsensitive(name: string) {
    return this.userRepository.findBy({
      name: ILike(name),
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

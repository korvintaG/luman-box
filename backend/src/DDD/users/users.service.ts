import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from './entities/user.entity'
import { omit }  from "lodash";

@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    const savedUser= await this.userRepository.save(user);
    return omit(savedUser,['password', 'id_out']);
  }

  findAll() {
    return `This action returns all users`;
  }

  find(name: string) {
    return name ? this.userRepository.find({ where: { name }, select: {id: true, name: true, password: true} }) : null;
  }

  findOne(id: number) {
    return id?this.userRepository.findOneBy({ id }):null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

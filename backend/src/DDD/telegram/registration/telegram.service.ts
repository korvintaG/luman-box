import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { TelegramSessions } from './entities/telegram-sessions.entity';
import { Repository, ILike } from 'typeorm';
import { CreateTelegramSessionsDto } from './dto/create-telegram-sessions.dto';
import { TelegramMessagingService } from '../messages/telegram-messages.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramSessionsService {
  constructor(
    @InjectRepository(TelegramSessions)
    private readonly telegramSessionsRepository: Repository<TelegramSessions>,
    private readonly messageService: TelegramMessagingService,
    private configService: ConfigService,
  ) {}

  private _genUser(user: Partial<TelegramSessions>) {
    console.log('TelegramSessionsService _genUser', user);
    return plainToInstance(TelegramSessions, user);
  }

  async create(createUserDto: CreateTelegramSessionsDto): Promise<TelegramSessions> {
    console.log('TelegramSessionsService create createUserDto=', createUserDto);
    const res = await this.saveUser(createUserDto);
    return res;
  }

  async saveUser(user: Partial<TelegramSessions>) {
    console.log('TelegramSessionsService saveUser', user);
    const userObj=this._genUser(user);
    console.log('TelegramSessionsService saveUser SUPERADMIN_USER_ID=', this.configService.get('SUPERADMIN_USER_ID'),userObj);
    const res=await this.telegramSessionsRepository.save(userObj);
    await this.messageService.sendMessage(this.configService.get('SUPERADMIN_USER_ID'), `Добавлен новый chat_id=${res.chat_id}`);
    return res;
  }

  findByChatId(chat_id: string) {
    console.log('TelegramSessionsService findByChatId', chat_id);
    return this.telegramSessionsRepository.findOneBy({ chat_id: chat_id });
  }

  findNameCaseInsensitive(name: string) {
    console.log('TelegramSessionsService findNameCaseInsensitive', name);
    return this.telegramSessionsRepository.findBy({
      name: ILike(name),
    });
  }
}

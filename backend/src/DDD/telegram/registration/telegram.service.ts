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
    console.log('TelegramSessionsService create SUPERADMIN_USER_ID=', this.configService.get('SUPERADMIN_USER_ID'));
    await this.messageService.sendMessage(this.configService.get('SUPERADMIN_USER_ID'), `Добавлен новый chat_id=${res.chat_id}`);
    return res;
  }

  saveUser(user: Partial<TelegramSessions>) {
    console.log('TelegramSessionsService saveUser', user);
    return this.telegramSessionsRepository.save(this._genUser(user));
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

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
    return plainToInstance(TelegramSessions, user);
  }

  async create(createUserDto: CreateTelegramSessionsDto): Promise<TelegramSessions> {
    const res = await this.saveUser(createUserDto);
    this.messageService.sendMessage(this.configService.get('SUPERADMIN_USER_ID'), `Добавлен новый пользователь chat_id=${res.chat_id} с id ${res.id}`);
    return res;
  }

  saveUser(user: Partial<TelegramSessions>) {
    return this.telegramSessionsRepository.save(this._genUser(user));
  }

  findByChatId(chat_id: string) {
    return this.telegramSessionsRepository.findOneBy({ chat_id: chat_id });
  }

  findNameCaseInsensitive(name: string) {
    return this.telegramSessionsRepository.findBy({
      name: ILike(name),
    });
  }
}

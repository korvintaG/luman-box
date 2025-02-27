import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { TelegramSessions } from './entities/telegram-sessions.entity';
import { Repository, ILike } from 'typeorm';
import { CreateTelegramSessionsDto } from './dto/create-telegram-sessions.dto';

@Injectable()
export class TelegramSessionsService {
  constructor(
    @InjectRepository(TelegramSessions)
    private readonly telegramSessionsRepository: Repository<TelegramSessions>,
  ) {}

  private _genUser(user: Partial<TelegramSessions>) {
    return plainToInstance(TelegramSessions, user);
  }

  create(createUserDto: CreateTelegramSessionsDto): Promise<TelegramSessions> {
    return this.saveUser(createUserDto);
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

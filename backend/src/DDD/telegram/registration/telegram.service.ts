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
    
    // Проверяем, что входные данные не пустые
    if (!user || Object.keys(user).length === 0) {
      console.error('TelegramSessionsService _genUser: empty or invalid input data', user);
      return null;
    }
    
    try {
      const instance = plainToInstance(TelegramSessions, user);
      console.log('Created instance:', instance);
      return instance;
    } catch (error) {
      console.error('TelegramSessionsService _genUser: error creating instance', error);
      return null;
    }
  }

  async create(createUserDto: CreateTelegramSessionsDto): Promise<TelegramSessions> {
    console.log('TelegramSessionsService create createUserDto=', createUserDto);
    const res = await this.saveUser(createUserDto);
    await this.messageService.sendMessage(this.configService.get('SUPERADMIN_USER_ID'), `Добавлен новый chat_id ${JSON.stringify(createUserDto, null, 2)}`);
    return res;
  }

  async saveUser(user: Partial<TelegramSessions>) {
    const userInstance = this._genUser(user);
    
    // Проверяем, что userInstance не null/undefined
    if (!userInstance) {
      throw new Error('Failed to create TelegramSessions instance from input data');
    }
    
    console.log('Chat ID:', userInstance.chat_id); // Теперь безопасно
    return this.telegramSessionsRepository.save(userInstance);
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

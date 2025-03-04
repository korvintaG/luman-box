import { Injectable, OnModuleInit  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramMessage } from './entities/telegram-message.entity';
import { Telegraf } from 'telegraf';
import { UsersService } from '../../users/users.service';
import { customLog } from '../registration/utils';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Not, IsNull } from 'typeorm';
import { CronJob } from 'cron';

@Injectable()
export class TelegramMessagingService implements OnModuleInit {
  private bot: Telegraf;

  constructor(
    @InjectRepository(TelegramMessage)
    private readonly telegramMessageRepository: Repository<TelegramMessage>,
    private readonly usersDB: UsersService,
    private readonly schedulerRegistry: SchedulerRegistry, // Добавляем SchedulerRegistry
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      this.bot = new Telegraf(token);
    } else {
      console.log('TELEGRAM_BOT_TOKEN не определен в переменных окружения');
    }
  }
  onModuleInit() {
    // Проверяем наличие переменных окружения
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.MSG_QUEUE_FREQUENCY) {
      console.log('TELEGRAM_BOT_TOKEN или MSG_QUEUE_FREQUENCY не определены в переменных окружения. Cron-задача не будет запущена.');
      return;
    }

    const job = new CronJob(
      process.env.MSG_QUEUE_FREQUENCY, 
      () => this.handleTelegramMsgQueue(), 
      null, 
      true, 
    );

    this.schedulerRegistry.addCronJob('handleTelegramMsgQueue', job);
  }

  /**
   * Добавляет сообщение в базу данных для последующей его обработки в очереди сообщений (функция handleTelegramMsgQueue)
   */
  async sendMessage(userId: number, text: string): Promise<void> {
    const message = new TelegramMessage();
    message.text = text;
    message.user_id = userId;
    await this.telegramMessageRepository.save(message);
    const user = await this.usersDB.findOne(userId);
    const chatId = user.chat_id;
    
    //если у user нет chat_id
    if (!chatId) {
      await this.telegramMessageRepository.update(message.id, {
        status: 2,
      });
      customLog(
        'TelegramMessage',
        '',
        '',
        `Попытка отправить сообщение пользователю id:${userId}, у которого нет chat_id`,
      );
      return;
    }
    message.chat_id = chatId;
    await this.telegramMessageRepository.update(message.id, {
      chat_id: chatId,
    });
  }

  /**
   * Обрабатывает очередь сообщений для отправки и пытается отправлять сообщения со статусом неотправленные один раз в минуту
   */
  async handleTelegramMsgQueue(): Promise<void> {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.MSG_QUEUE_FREQUENCY) {
      return;
    }

    try {
      // customLog('TelegramMessage', '', '', `Проверка очереди сообщений..`);

      // Ищем неотправленные сообщения (status = 0)
      const messages = await this.telegramMessageRepository.find({
        where: [
          { status: 0, chat_id: Not(IsNull()) }, // Сообщения в очереди
        ],
      });

      // if (messages.length === 0) {
      //   customLog(
      //     'TelegramMessage',
      //     '',
      //     '',
      //     `Нет сообщений для отправки в очереди`,
      //   );
      // }

      // customLog(
      //   'TelegramMessage',
      //   '',
      //   '',
      //   `Найдено ${messages.length} сообщений в очереди для отправки`,
      // );

      // Отправляем каждое сообщение
      for (const message of messages) {
        try {
          const telegramMessage = await this.bot.telegram.sendMessage(
            message.chat_id,
            message.text,
          );
          await this.telegramMessageRepository.update(message.id, {
            status: 1,
            date_time_send: () => `to_timestamp(${telegramMessage.date})`,
          });
          customLog(
            'TelegramMessage',
            '',
            '',
            `Сообщение id: ${message.id}, text: ${message.text} отправлено пользователю id: ${message.user_id}`,
          );
        } catch (e) {
          await this.telegramMessageRepository.update(message.id, {
            status: 2,
          });
          customLog(
            'TelegramMessage',
            '',
            '',
            `Сообщение id: ${message.id} пользователю id: ${message.user_id} не отправлено`,
          );
        }
      }
    } catch (e) {
      customLog(
        'TelegramMessage',
        '',
        '',
        `Ошибка при обработке очереди сообщений: ${e.message}`,
      );
    }
  }
}

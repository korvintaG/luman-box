import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramMessage } from './entities/telegram-message.entity';
import { Telegraf } from 'telegraf';
import { UsersService } from '../../users/users.service';
import { customLog } from '../registration/utils';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Not, IsNull } from 'typeorm';
import { CronJob } from 'cron';
import e from 'express';
import { createDiffieHellman } from 'crypto';

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
      console.log(
        'TELEGRAM_BOT_TOKEN или MSG_QUEUE_FREQUENCY не определены в переменных окружения. Cron-задача не будет запущена.',
      );
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
    const user = await this.usersDB.findOne(userId);
    if (!user) {
      customLog(
        'TelegramMessage',
        '',
        '',
        `Попытка отправить сообщение пользователю id:${userId}, которого нет в базе данных`,
      );
      return;
    }
    if (!user.chat_id) {
      customLog(
        'TelegramMessage',
        '',
        '',
        `Попытка отправить сообщение пользователю id:${userId}, у которого нет chat_id`,
      );
      return;
    }
    const message = new TelegramMessage();
    message.text = text;
    message.user_id = userId;
    message.chat_id = user.chat_id;
    await this.telegramMessageRepository.save(message);
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
        where: [{ status: 0 }],
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
        //если не задан chat_id сообщения
        if (message.chat_id) {
          //если у пользователя есть chat_id и chat_id добавлен в таблицу telegram_messages
          try {
            const telegramMessage = await this.bot.telegram.sendMessage(
              message.chat_id,
              message.text,
            );
            await this.telegramMessageRepository.update(message.id, {
              status: 1,
              chat_id: message.chat_id,
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
              chat_id: message.chat_id,
            });
            customLog(
              'TelegramMessage',
              '',
              '',
              `Сообщение id: ${message.id} пользователю id: ${message.user_id} не отправлено`,
            );
          }
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

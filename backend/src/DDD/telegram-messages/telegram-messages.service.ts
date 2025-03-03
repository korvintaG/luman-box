import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramMessage } from './entities/telegram-message.entity';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';
import { customLog } from '../telegram/utils';
import { Cron } from '@nestjs/schedule';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class TelegramMessagingService {
  private bot: Telegraf;

  constructor(
    @InjectRepository(TelegramMessage)
    private readonly telegramMessageRepository: Repository<TelegramMessage>,
    private readonly usersDB: UsersService,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      this.bot = new Telegraf(token);
    } else {
      console.log('TELEGRAM_BOT_TOKEN не определен в переменных окружения');
    }
  }

  /**
   * Отправляет сообщение через Telegram и сохраняет его в базу данных
   */
  async sendMessage(userId: number, text: string): Promise<void> {
    const message = new TelegramMessage();
    message.text = text;
    message.user_id = userId;
    await this.telegramMessageRepository.save(message);
    const user = await this.usersDB.findOne(userId);
    const chatId = user.chat_id;

    if (chatId) {
      try {
        const telegramMessage = await this.bot.telegram.sendMessage(
          chatId,
          text,
        );
        await this.telegramMessageRepository.update(message.id, {
          status: 1,
          date_time_send: () => `to_timestamp(${telegramMessage.date})`,
          chat_id: chatId,
        });
        customLog(
          'TelegramMessage',
          chatId,
          '',
          `Сообщение успешно отправлено и сохранено`,
        );
      } catch (e) {
        await this.telegramMessageRepository.update(message.id, {
          status: 2,
          chat_id: chatId,
        });
        customLog('TelegramMessage', chatId, '', `Сообщение не отправлено`);
      }
    } else {
      //если у user нет chat_id
      await this.telegramMessageRepository.update(message.id, {
        status: 2,
      });
      customLog(
        'TelegramMessage',
        '',
        '',
        `Попытка отправить сообщение пользователю id:${userId}, у которого нет chat_id`,
      );
    }
  }

  /**
   * Обрабатывает очередь сообщений для отправки и пытается отправлять сообщения со статусом неотправленные один раз в минуту
   */
  @Cron(process.env.MSG_QUEUE_FREQUENCY) // Частота запуска
  async handleTelegramMsgQueue(): Promise<void> {
    try {
      customLog('TelegramMessage', '', '', `Проверка очереди сообщений..`);

      // Ищем неотправленные сообщения (status = 0)
      const messages = await this.telegramMessageRepository.find({
        where: [
          { status: 0, chat_id: Not(IsNull()) }, // Сообщения в очереди
          { status: 2, chat_id: Not(IsNull()) }, // Сообщения с ошибкой
        ],
      });

      if (messages.length === 0) {
        customLog(
          'TelegramMessage',
          '',
          '',
          `Нет сообщений для отправки в очереди`,
        );
      }

      customLog(
        'TelegramMessage',
        '',
        '',
        `Найдено ${messages.length} сообщений в очереди для отправки`,
      );

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
        } catch (e) {
          await this.telegramMessageRepository.update(message.id, {
            status: 2,
          });
          customLog(
            'TelegramMessage',
            '',
            '',
            `Сообщение id: ${message.id} не отправлено`,
          );
        }
      }
    } catch (e) {
      customLog(
        'TelegramMessage',
        '',
        '',
        `Ошибка при обработке очереди сообщений: ${exports.message}`,
      );
    }
  }
}

import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Keyword, KeywordModeration, KeywordName } from './entities/keyword.entity';
import { ExceptionType, IModerate, IUser } from '../../types/custom';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import { ModeratorService } from '../../shared/services/moderator/moderator.service';
import { TelegramMessagingService } from '../telegram/messages/telegram-messages.service';
import { throwException } from 'src/utils/utils';

@Injectable()
export class KeywordsModerationService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
    @InjectRepository(KeywordModeration)
    private readonly keywordModerationRepository: Repository<KeywordModeration>,
    @InjectRepository(KeywordName)
    private readonly keywordNameRepository: Repository<KeywordName>,
    //private moderatorService: ModeratorService,
    private telegramMessagingService: TelegramMessagingService,
  ) {}

  async toModerate(id: number, user: IUser, isCascade: boolean = false) {
    const rec = await this.keywordRepository.findOne({ where: { id }, relations: ['names'] });
    if (!rec)
      throwException(ExceptionType.NotFoundException,
        `Не удалось найти ключевое слово на модерацию`);

    switch (rec.verification_status) {
      case VerificationStatus.Creating: // новое
        if (rec.user_id !== user.id)
          throwException(ExceptionType.UnauthorizedException,
             `У Вас нет прав передавать это ключевое слово на модерацию!`);

        const res = await this.keywordRepository.update(
          { id },
          {
            date_time_to_moderate: new Date(),
            verification_status: VerificationStatus.ToModerate,
          },
        );
        const resNames = await this.keywordNameRepository.update(
          { keyword_id: id },
          {
            date_time_to_moderate: new Date(),
            verification_status: VerificationStatus.ToModerate,
          },
        );
        if (res.affected === 0 || resNames.affected === 0)
          throwException(ExceptionType.BadRequestException,
            `Не удалось перевести ключевое слово в статус на модерацию`);

        else {
          await this.telegramMessagingService.sendMessageToAdmin(
            `Новая запись ключевого слова ${process.env.FRONTEND_URL}${process.env.ROUTE_KEYWORD_DETAIL}/${id} на модерации`,
          );
          
          // Рекурсивно обновляем все родительские ключевые слова от того же пользователя в состоянии Creating
          await this.updateParentKeywordsToModerate(rec.class_keyword_id, user.id);
          
          return {
            success: true,
            id: id,
            message: `Ключевое слово переведено в статус на модерацию`,
            moderationStatus: VerificationStatus.ToModerate,
          };
        }
        break;

      case VerificationStatus.Moderated: // старое
        const names2M = rec.names.filter(
          (el) => el.verification_status === VerificationStatus.Creating && el.user_id === user.id,
        );
        if (names2M.length > 0) {
          const newKWModerate = await this.keywordModerationRepository.save(
            {
              keyword_id: id,
              user_id: user.id,
              verification_status: VerificationStatus.ToModerate,
              date_time_to_moderate: new Date()
            }
          )
          const resNames = await this.keywordNameRepository.update(
            { id: In(names2M.map((cel) => cel.id)) },
            {
              date_time_to_moderate: new Date(),
              verification_status: VerificationStatus.ToModerate,
              keyword_moderation_id: newKWModerate.id
            },
          );

          if (resNames.affected === 0)
            throwException(ExceptionType.BadRequestException,
               `Не удалось перевести синонимы ключевых слов в статус на модерацию`);

          await this.telegramMessagingService.sendMessageToAdmin(
            `Новые синонимы ключевого слова ${process.env.FRONTEND_URL}${process.env.ROUTE_KEYWORD_DETAIL}/${id}?keyword_moderation_id=${newKWModerate.id} на модерации`,
          );
  
          return {
            success: true,
            id: id,
            keyword_moderation_id: newKWModerate.id,
            message: `Синонимы ключевых слов переведены в статус на модерацию`,
            moderationStatus: VerificationStatus.ToModerate,
          };
        }
        else
          throwException(ExceptionType.BadRequestException,
            `Нет новых синонимов ключевых слов на модерацию!`);
        break;

      default:
        throwException(ExceptionType.BadRequestException,
          `Плохая передача ключевого слова на модерацию!`);
    }

    /*return this.moderatorService.toModerateEntity(
      this.keywordRepository,
      id,
      user,
      process.env.ROUTE_KEYWORD_DETAIL,
      'Ключевое слово',
      isCascade
    );*/
  }

  async moderate(id: number, user: IUser, moderationResult: IModerate) {
    const rec = await this.keywordRepository.findOne({ where: { id }, relations: ['names'] });
    
    if (!rec)
      throwException(ExceptionType.NotFoundException, `Не удалось найти ключевое слово для модерации!`);

    switch (rec.verification_status) {
    case VerificationStatus.ToModerate: {
      const res = await this.keywordRepository.update(
        {id},
        {
          verified_user_id: user.id,
          date_time_moderated: new Date(),
          moderation_notes: moderationResult.notes,
          verification_status:
            moderationResult.action === 'approve'
              ? VerificationStatus.Moderated
              : VerificationStatus.Rejected,
        } 
      );
  
      if (res.affected === 0) 
        throwException(ExceptionType.NotFoundException, `Ключевое слово не найдено при процессе модерации!`);

      const resNames = await this.keywordNameRepository.update(
        { keyword_id: id },
        {
          verified_user_id: user.id,
          date_time_moderated: new Date(),
          moderation_notes: moderationResult.notes,
          verification_status:
            moderationResult.action === 'approve'
              ? VerificationStatus.Moderated
              : VerificationStatus.Rejected,
        } 
      );

      if (resNames.affected === 0) 
        throwException(ExceptionType.NotFoundException, `Синонимы ключевых слов не найдены при процессе модерации!`);
  
      // Если модерация одобрена, рекурсивно одобряем все родительские ключевые слова от того же пользователя в состоянии ToModerate
      if (moderationResult.action === 'approve') {
        await this.approveParentKeywords(rec.class_keyword_id, rec.user_id, user.id, moderationResult.notes);
      }
      
      return {
        success: true,
        id: id,
        message: `Keyword moderated successfully`,
        moderationStatus: moderationResult.action,
      };
    }
    break;

    case VerificationStatus.Moderated: {
      if (!moderationResult.moderation_record_id)
        throwException(ExceptionType.BadRequestException,
          `Для модерации добавленных дополнительно синонимов нужно указать ID сеанса модерации!`);

      console.log('moderate',rec.names,'moderationResult.moderation_record_id=',moderationResult.moderation_record_id)
      const moderation_record_id = Number(moderationResult.moderation_record_id);
      const names2M = rec.names.filter(
        (el) => el.verification_status === VerificationStatus.ToModerate 
                && el.keyword_moderation_id === moderation_record_id
      );

      if (names2M.length===0) 
        throwException(ExceptionType.BadRequestException,
          `Нет синонимов для акта модерации!`);
      
      const moderationAction = moderationResult.action === 'approve'
      ? VerificationStatus.Moderated
      : VerificationStatus.Rejected

      const res = await this.keywordNameRepository.update(
        { id: In(names2M.map((cel) => cel.id)) },
        {
          verified_user_id: user.id,
          date_time_moderated: new Date(),
          moderation_notes: moderationResult.notes,
          verification_status: moderationAction
        } 
      );

      if (res.affected === 0) 
        throwException(ExceptionType.NotFoundException,
          `Синонимы ключевых слов не найдены при процессе модерации!`);

      const resModerationUpdate = await this.keywordModerationRepository.update(
        {id: moderation_record_id}, 
        {
          verification_status: moderationAction,
          moderation_notes: moderationResult.notes

        }
      )
  
      if (resModerationUpdate.affected===0)
        throwException(ExceptionType.NotFoundException,
          `Не найдена запись акта модерации для обновления!`);

      return {
        success: true,
        id: id,
        message: `Keyword moderated successfully`,
        moderationStatus: moderationResult.action,
      };
      }
      break;

    default:
      throwException(ExceptionType.BadRequestException,
        `Нельзя модерировать ключевое слово в статусе ${rec.verification_status}!`);
    }
    /*return this.moderatorService.moderateEntity(
      this.keywordRepository,
      id,
      user,
      moderationResult,
      'Ключевое слово',
    );*/
  }

  /**
   * Рекурсивно обновляет все родительские ключевые слова в состоянии Creating 
   * от указанного пользователя, переводя их в статус ToModerate
   * @param classKeywordId - ID родительского ключевого слова (class_keyword_id)
   * @param userId - ID пользователя
   */
  private async updateParentKeywordsToModerate(classKeywordId: number, userId: number): Promise<void> {
    // Базовый случай: если class_keyword_id равен 0 или null, значит это корневой элемент
    if (!classKeywordId || classKeywordId === 0) {
      return;
    }

    // Находим родительское ключевое слово
    const parentKeyword = await this.keywordRepository.findOne({
      where: { id: classKeywordId },
    });

    // Если родитель не найден или не соответствует условиям, прекращаем рекурсию
    if (
      !parentKeyword ||
      parentKeyword.verification_status !== VerificationStatus.Creating ||
      parentKeyword.user_id !== userId
    ) {
      // Продолжаем рекурсию вверх по иерархии, даже если текущий родитель не подходит
      if (parentKeyword?.class_keyword_id) {
        await this.updateParentKeywordsToModerate(parentKeyword.class_keyword_id, userId);
      }
      return;
    }

    // Обновляем родительское ключевое слово и его синонимы
    await this.keywordRepository.update(
      { id: classKeywordId },
      {
        date_time_to_moderate: new Date(),
        verification_status: VerificationStatus.ToModerate,
      },
    );

    await this.keywordNameRepository.update(
      { keyword_id: classKeywordId },
      {
        date_time_to_moderate: new Date(),
        verification_status: VerificationStatus.ToModerate,
      },
    );

    // Рекурсивно обрабатываем следующий уровень вверх по иерархии
    await this.updateParentKeywordsToModerate(parentKeyword.class_keyword_id, userId);
  }

  /**
   * Рекурсивно одобряет все родительские ключевые слова в состоянии ToModerate 
   * от указанного пользователя, переводя их в статус Moderated
   * @param classKeywordId - ID родительского ключевого слова (class_keyword_id)
   * @param userId - ID пользователя-владельца ключевого слова
   * @param moderatorId - ID пользователя-модератора
   * @param notes - Заметки модерации
   */
  private async approveParentKeywords(
    classKeywordId: number, 
    userId: number, 
    moderatorId: number, 
    notes?: string
  ): Promise<void> {
    // Базовый случай: если class_keyword_id равен 0 или null, значит это корневой элемент
    if (!classKeywordId || classKeywordId === 0) {
      return;
    }

    // Находим родительское ключевое слово
    const parentKeyword = await this.keywordRepository.findOne({
      where: { id: classKeywordId },
    });

    // Если родитель не найден или не соответствует условиям, прекращаем рекурсию
    if (
      !parentKeyword ||
      parentKeyword.verification_status !== VerificationStatus.ToModerate ||
      parentKeyword.user_id !== userId
    ) {
      // Продолжаем рекурсию вверх по иерархии, даже если текущий родитель не подходит
      if (parentKeyword?.class_keyword_id) {
        await this.approveParentKeywords(parentKeyword.class_keyword_id, userId, moderatorId, notes);
      }
      return;
    }

    // Одобряем родительское ключевое слово и его синонимы
    await this.keywordRepository.update(
      { id: classKeywordId },
      {
        verified_user_id: moderatorId,
        date_time_moderated: new Date(),
        moderation_notes: notes,
        verification_status: VerificationStatus.Moderated,
      },
    );

    await this.keywordNameRepository.update(
      { keyword_id: classKeywordId },
      {
        verified_user_id: moderatorId,
        date_time_moderated: new Date(),
        moderation_notes: notes,
        verification_status: VerificationStatus.Moderated,
      },
    );

    // Рекурсивно обрабатываем следующий уровень вверх по иерархии
    await this.approveParentKeywords(parentKeyword.class_keyword_id, userId, moderatorId, notes);
  }
}


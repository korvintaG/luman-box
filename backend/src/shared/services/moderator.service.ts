import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';

import { IModerate, IUser, Role } from '../../types/custom';
import { VerificationStatus } from '../entities/abstract.entity';
import { TelegramMessagingService } from 'src/DDD/telegram/messages/telegram-messages.service';

export interface IModerationResult {
  success: boolean;
  id: number;
  message: string;
  moderationStatus: IModerate['action'];
}

export interface IToModerateResult {
  success: boolean;
  id: number;
  message: string;
  moderationStatus: VerificationStatus;
}

export interface IModeratableEntity {
  id: number;
  user_id: number;
  verified_user_id: number;
  date_time_moderated: Date;
  date_time_to_moderate: Date;
  verification_status: VerificationStatus;
}

@Injectable()
export class ModeratorService {

  constructor(
    private TelegramMessagingService: TelegramMessagingService
  ) { }

  /**
   * Проверяет права доступа к сущности для DML операций
   * @param repository - репозиторий сущности
   * @param id - ID сущности
   * @param user - пользователь-модератор
   * @returns найденная запись, если есть
   */
  async checkDMLAccess<T extends IModeratableEntity>(
    repository: Repository<T>,
    id: number,
    user: IUser) {
    const whereCondition = { id } as FindOptionsWhere<T>;
    const [recordOld] = await repository.find({
      where: whereCondition,
      relations: ['user'],
    });
    if (!recordOld)
      throw new NotFoundException({
        error: 'NotFound',
        message: 'Не найдена запись для операции',
      });
    if (recordOld.user_id !== user.id && user.role_id !== Role.SuperAdmin)
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'У Вас нет прав на редактирование записей, добавленных не Вами',
      });
    if (recordOld.verification_status !== VerificationStatus.Creating && user.role_id === Role.User)
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'У Вас нет прав на редактирование записей, уже переданных на модерацию',
      });
    return recordOld;
  }


  /**
   * Модерирует сущность (одобряет или отклоняет)
   * @param repository - репозиторий сущности
   * @param id - ID сущности
   * @param user - пользователь-модератор
   * @param action - действие модерации
   * @param entityName - название сущности для сообщений об ошибках
   * @returns результат модерации
   */
  async moderateEntity<T extends IModeratableEntity>(
    repository: Repository<T>,
    id: number,
    user: IUser,
    moderationResult: IModerate,
    entityName: string,
    //moderationNotes: string
  ): Promise<IModerationResult> {
    const whereCondition = { id } as FindOptionsWhere<T>;
    const res = await repository.update(
      whereCondition,
      {
        verified_user_id: user.id,
        date_time_moderated: new Date(),
        moderation_notes: moderationResult.notes,
        verification_status:
          moderationResult.action === 'approve'
            ? VerificationStatus.Moderated
            : VerificationStatus.Rejected,
      } as any // сложно типизировать update в typeorm
    );

    if (res.affected === 0) {
      throw new NotFoundException({
        error: 'NotFound',
        message: `${entityName} не найден`,
      });
    }

    return {
      success: true,
      id: id,
      message: `${entityName} moderated successfully`,
      moderationStatus: moderationResult.action,
    };
  }

  /**
   * Переводит сущность в статус на модерацию
   * @param repository - репозиторий сущности
   * @param id - ID сущности
   * @param user - пользователь, создавший сущность
   * @param entityName - название сущности для сообщений об ошибках
   * @returns результат перевода в статус модерации
   */
  async toModerateEntity<T extends IModeratableEntity>(
    repository: Repository<T>,
    id: number,
    user: IUser,
    routeForModeration: string,
    entityName: string,
    isCascade: boolean = false
  ): Promise<IToModerateResult> {
    if (!isCascade)
      await this.checkToModerateCount(repository, user, entityName);
    const record = await repository.findOne(
      { where: { id } as FindOptionsWhere<T> });
    if (!record) {
      throw new NotFoundException({
        error: 'NotFound',
        message: `${entityName} не найден`
      });
    }
    if (record.verification_status !== VerificationStatus.Creating) {
      throw new BadRequestException({
        error: 'Bad Request',
        message: `${entityName} находится не в статусе создания`
      });
    }
    if (record.user_id !== user.id) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: `Вы не можете перевести в статус на модерацию ${entityName.toLowerCase()}, которого не создавали`
      });
    }
    const whereCondition = { id } as FindOptionsWhere<T>;
    const res = await repository.update(
      whereCondition,
      {
        date_time_to_moderate: new Date(),
        verification_status: VerificationStatus.ToModerate,
      } as any // сложно типизировать update в typeorm
    );
    if (res.affected === 0)
      throw new BadRequestException({
        error: 'Bad Request',
        message: `Не удалось перевести в статус на модерацию`
      });
    else {
      await this.TelegramMessagingService.sendMessageToAdmin(
        `Новая запись ${entityName} ${process.env.FRONTEND_URL}${routeForModeration}/${id} на модерации`);
      return {
        success: true,
        id: id,
        message: `${entityName} переведен в статус на модерацию`,
        moderationStatus: VerificationStatus.ToModerate
      };
    }
  }

  /**
   * Проверяет количество черновиков сущности для пользователя
   * @param repository - репозиторий сущности
   * @param user - пользователь
   * @param entityName - название сущности для сообщений об ошибках
   * @returns void
   * @throws HttpException если превышено максимальное количество черновиков
   */
  async checkDraftCount<T extends IModeratableEntity>(
    repository: Repository<T>,
    user: IUser,
    entityName: string
  ): Promise<void> {
    const draftUserCount = await repository.count({
      where: {
        user_id: user.id,
        verification_status: VerificationStatus.Creating
      } as any
    });

    if (draftUserCount > Number(process.env.MAX_USER_ENTITY_DRAFT)) {
      throw new BadRequestException({
        error: 'Bad Request',
        message: `Слишком много черновиков сущности [${entityName}] для пользователя`
      });
    }
  }

  async checkToModerateCount<T extends IModeratableEntity>(
    repository: Repository<T>,
    user: IUser,
    entityName: string
  ): Promise<void> {
    const toModerateUserCount = await repository.count({
      where: {
        user_id: user.id,
        verification_status: VerificationStatus.ToModerate
      } as any
    });

    if (toModerateUserCount > Number(process.env.MAX_USER_ENTITY_TO_MODERATE)) {
      throw new BadRequestException({
        error: 'Bad Request',
        message: `Слишком много сущности [${entityName}] на модерацию от пользователя`
      });
    }
  }
} 
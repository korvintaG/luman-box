import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { IUser, SimpleEntity, Role } from '../types/custom';

export function joinSimpleEntityFirst(
  relations: SimpleEntity[],
  max: number = 4,
): string {
  let errMessage = '';
  for (let i in relations) {
    if (Number(i) >= max) errMessage = errMessage + ' ...';
    else
      errMessage =
        errMessage +
        ' [' +
        relations[i].name +
        ' (id=' +
        relations[i].id +
        ')]';
  }
  return errMessage;
}

export async function checkAccess(
  rep: Repository<any>,
  id_record: number,
  user: IUser,
) {
  const [recordOld] = await rep.find({
    where: { id: id_record },
    relations: ['user'],
  });
  if (!recordOld)
    throw new HttpException(
      {
        message: 'Не найдена запись для операции',
      },
      HttpStatus.BAD_REQUEST,
    );
  if (recordOld.user.id !== user.id && user.role_id !== Role.SuperAdmin)
    throw new UnauthorizedException({
      message: 'У Вас нет прав на редактирование записей, добавленных не Вами',
    });
}

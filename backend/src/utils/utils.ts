import {
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { IUser, SimpleEntity, Role } from '../types/custom';
import fs from 'fs/promises'
import path from 'path';

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

export function getUserSQLFilter(user: IUser, prefix?: string): string {
  let addCond = ''; // по умолчанию админ, выводим все
  let genPrefix = prefix ? `${prefix}.` : '';
  if (!user) // нет входа в систему
    addCond = ` and ${genPrefix}moderated>0 `
  else {
    if (user.role_id === Role.User) // простой пользователь - выводим отмодерированное и его
      addCond = ` and (${genPrefix}moderated>0 or ${genPrefix}user_id=${user.id})`
  }
  return addCond;
}

export function trimSlashesAndPoints(str: string): string {
  let res = str.replaceAll('/', '');
  res = res.replaceAll('\\', '');
  res = res.replaceAll('.', '');
  return res;
}

export async function safeRename(oldPath: string, newPath: string) {
  const dir = path.dirname(newPath);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.rename(oldPath, newPath);
    //console.log('Файл успешно перемещён!');
  } catch (err) {
    //console.error('Ошибка перемещения файла:', err);
    throw new BadRequestException(`Ошибка перемещения файла ${oldPath} в ${newPath}: ${err.message}`);
  }
}
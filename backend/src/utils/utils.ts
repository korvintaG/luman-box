import {
  BadRequestException,
} from '@nestjs/common';
import { IUser, SimpleEntity, Role } from '../types/custom';
import fs from 'fs/promises'
import path from 'path';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';

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

export function getUserSQLFilter(user: IUser, prefix?: string): string {
  let addCond = ''; // по умолчанию админ, выводим все
  let genPrefix = prefix ? `${prefix}.` : '';
  if (!user) // нет входа в систему
    addCond = ` and ${genPrefix}verification_status=${VerificationStatus.Moderated} `
  else {
    if (user.role_id === Role.User) // простой пользователь - выводим отмодерированное и его
      addCond = ` and (${genPrefix}verification_status=${VerificationStatus.Moderated} or ${genPrefix}user_id=${user.id})`
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
    throw new BadRequestException(
      {
        error: 'Bad Request',
        message: `Ошибка перемещения файла ${oldPath} в ${newPath}: ${err.message}`
      }
    );
  }
}

export async function getFileCreateDate(filePath: string): Promise<string> {
  try {
    const stats = await fs.stat(filePath);
    const fileDate = stats.mtime.toDateString();
    return fileDate;
  } catch (err) {
    return null;
  }
}

export function formatDateForFilename(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`
}
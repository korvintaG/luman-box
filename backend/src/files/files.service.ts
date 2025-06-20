import { Request } from 'express';
import { BadRequestException, Injectable } from '@nestjs/common';
import { unlink, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { safeRename } from 'src/utils/utils';
import { Cron, CronExpression } from '@nestjs/schedule';
import { STORE_FILE_PATH, UPLOAD_FILE_PATH } from './utils';

@Injectable()
export class FilesService {
  constructor(
  ) { }

  async uploadImage(file: Express.Multer.File, req: Request) {
    // Здесь file содержит информацию о загруженном файле
    // Можно сохранить путь к файлу в базе данных
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('Файл не был загружен');
    }
    return {
      message: 'Image uploaded successfully',
      file_name: file.filename,
      full_file_name: file.path,
    };
  }

  async updateRecordImage(oldImage: string | null, newImage: string | null, prefix: string) {
    let returnImage = '';
    if (newImage !== oldImage) { // мучать фото
      if (!newImage) {// удаление фото
        if (oldImage) { // было ли?
          const delFile = join(STORE_FILE_PATH(), oldImage)
          await unlink(delFile)
        }
        returnImage = null;
      }
      else
        if (!oldImage) {// назначение фото 
          const prefixedFileName = prefix + newImage;
          const newFileName = join(UPLOAD_FILE_PATH(), newImage);
          const storedNewFileName = join(STORE_FILE_PATH(), prefixedFileName);
          await safeRename(newFileName, storedNewFileName);
          returnImage = prefixedFileName
        }
    }
    else
      returnImage = oldImage;
    return returnImage;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupOldFiles() {
    try {
      //console.log(`cleanupOldFiles`,UPLOAD_FILE_PATH,process.env.UPLOAD_FILE_PATH);
      const files = await readdir(UPLOAD_FILE_PATH());
      const now = Date.now();
      const olderThanMinutes = Number(process.env.MAX_UPLOADS_FILES_SAVE_MINUTES); 

      for (const file of files) {
        const filePath = join(UPLOAD_FILE_PATH(), file);
        const stats = await stat(filePath);
        const fileAgeInMinutes = (now - stats.mtime.getTime()) / (1000 * 60);

        if (fileAgeInMinutes > olderThanMinutes) {
          await unlink(filePath);
          console.log(`Удалён файл: ${filePath}`);
        }
      }
    } catch (err) {
      console.log(`Ошибка при удалении файлов: ${err.message}`);
    }
  }

}

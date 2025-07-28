import { FileFilterCallback, diskStorage } from 'multer';
import { Request } from 'express';
import { extname } from 'path';
import { UPLOAD_FILE_PATH, calcFilesByMask, getFileNamePrefix } from './utils';
import { ConfigService } from '@nestjs/config';

export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOAD_FILE_PATH());
        },
        filename: (req, file, callback) => {
            const uniqueSuffix = getFileNamePrefix(req) + Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
        (async () => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                req.fileValidationError = 'Допустимы только файлы JPEG, PNG или GIF';
                return callback(null, false);
            }
            const length = await calcFilesByMask(UPLOAD_FILE_PATH(), `${getFileNamePrefix(req)}*.*`)
            if (length > Number(process.env.MAX_UPLOADS_FILES_FROM_USER)) {
                req.fileValidationError = 'Превышено число загружаемых файлов от пользователя!';
                return callback(null, false);
            }
            callback(null, true);
        })();
    },
    limits: {
        fileSize: (() => {
            const configService = new ConfigService();
            return configService.get<number>('MAX_FILE_SIZE_MB', 1) * 1024 * 1024; // По умолчанию 1MB
        })(),
    },
};
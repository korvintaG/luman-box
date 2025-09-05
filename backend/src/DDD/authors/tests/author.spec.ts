import { NestExpressApplication } from '@nestjs/platform-express';

import request from 'supertest';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import {
  createAuthor,
  deleteAuthor,
  toModerateAuthor,
  moderateAuthor,
  findAuthors,
  updateAuthor,
} from './author.helper';
import { checkPhoto, checkPhotoAbsent, uploadPhoto } from 'src/files/tests/files.helpers';
import { setupTestApp } from 'src/test/helpers';

const authorsToAdd = [
  {
    name: 'Added by User',
    birth_date: '1990-01-01',
  },
];

let tokenUser: string;
let tokenAdmin: string;
let tokenSuperAdmin: string;
let authorID: number;
let authorImage: string;


describe('AuthService (integration)', () => {
  let app: NestExpressApplication;
  let server: any;

  const getAddedAuthorID = async () => {
    const findRes = await findAuthors(server, tokenSuperAdmin, authorsToAdd[0]);    
    if (findRes.body.length!==0) {
      return findRes.body[0].id;
    }
    return null;
  };

  const withExistingAuthor = async (
    errorMessage: string,
    action: (authorID: number) => Promise<void>,
  ) => {
    const authorID = await getAddedAuthorID();
    if (authorID) {
      await action(authorID);
    } else {
      throw new Error(errorMessage);
    }
  };


  beforeAll(async () => {
    ({ app, server, tokenUser, tokenAdmin, tokenSuperAdmin } = await setupTestApp());
  });

  afterAll(async () => {
    await app?.close();
  });


  it('анонимное чтение списка авторов', async () => {
    const res = await request(server).get('/api/authors').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(5);

    const first = res.body[0];
    expect(first).toHaveProperty('id');
    expect(typeof first.id).toBe('number');
    expect(first).toHaveProperty('name');
    expect(typeof first.name).toBe('string');
    if (first.birth_date !== undefined) {
      expect(typeof first.birth_date === 'string' || first.birth_date === null).toBe(true);
    }
  });

  it('попытка создать автора без авторизации должна вернуть 401', async () => {
    const res = await request(server).post('/api/authors').expect(401);
    expect(res.body.message).toBe('Unauthorized');
  });

  it('удаление старого мусора с авторами если остался таковой', async () => {
    // ищем авторов для удаления (суперадмин)
    const findRes = await findAuthors(server, tokenSuperAdmin, authorsToAdd[0]);
    // если найден, удаляем (суперадмин)
    if (findRes.body.length!==0) {
      const delRes=await deleteAuthor(server, tokenSuperAdmin, findRes.body[0].id);
    }
  });

  it('создание автора пользователем', async () => {
    // создаем автора (пользователь)
    const res = await createAuthor(server, tokenUser, authorsToAdd[0]);
    expect(res.body.name).toBe(authorsToAdd[0].name);
    expect(res.body.birth_date).toBe(authorsToAdd[0].birth_date);
    authorID = res.body.id;
  });

  it('модификация автора пользователем', async () => {
      const res=await updateAuthor(server, tokenUser, authorID, { about_author: 'test about author' });
      expect(res.body.about_author).toBe('test about author');
  });

  it('загрузка фото автора пользователем', async () => {
      const res=await uploadPhoto(server, tokenUser, process.env.AUTHOR_PHOTO as string);
      expect(res.body.file_name).toBeDefined();
      const res2=await updateAuthor(server, tokenUser, authorID, { image_URL: res.body.file_name });
      expect(res2.body.image_URL).toBeDefined();
      authorImage = res2.body.image_URL;
      await checkPhoto(server, authorImage);
  });

  it('попытка создать автора-копии пользователем должна вернуть 500', async () => {
    // создаем такого же автора, должна быть ошибка уникальности (пользователь)
    const resCopy = await createAuthor(server, tokenUser, authorsToAdd[0], 500);
  });

  it('удаление автора пользователем', async () => {
      const delRes=await deleteAuthor(server, tokenUser, authorID);
  });

  it('проверка удаления фото при удалении автора пользователем', async () => {
    await checkPhotoAbsent(server, authorImage);
  });

  it('добавления нового автора пользователем сразу с фото', async () => {
    const res=await uploadPhoto(server, tokenUser, process.env.AUTHOR_PHOTO as string);
    expect(res.body.file_name).toBeDefined();
    const res2=await createAuthor(server, tokenUser, {...authorsToAdd[0], image_URL: res.body.file_name });
    authorID = res2.body.id;
    expect(res2.body.image_URL).toBeDefined();
    authorImage = res2.body.image_URL;
    await checkPhoto(server, authorImage);
  });

  it('публикация автора пользователем', async () => {
    // посылаем запрос на "к модерации" (пользователь)
    const resModerate = await toModerateAuthor(server, tokenUser, authorID);
  });

  it('попытка удалить автора пользователем после публикации должна вернуть 401', async () => {
      const delRes=await deleteAuthor(server, tokenUser, authorID, 401);
  });

  it('попытка публикации пользователем автора после публикации вернуть ошибку 400', async () => {
      const resModerate2 = await toModerateAuthor(server, tokenUser, authorID, 400);
  });

  it('модерация автора администратором', async () => {
      // модерируем автора (админ)
      const resModerateAdmin = await moderateAuthor(server, tokenAdmin, authorID, 'approve');
      // проверяем, что модерация прошла успешно
      const findRes2 = await findAuthors(server, tokenSuperAdmin, authorsToAdd[0]);
      expect(findRes2.body.length).toBe(1);
      expect(findRes2.body[0].verification_status).toBe(VerificationStatus.Moderated);
  }); 

  it('попытка удалить автора администратором после модерации должна вернуть 401', async () => {
      const delRes=await deleteAuthor(server, tokenAdmin, authorID, 401);
  });

  it('удаление автора суперадмином', async () => {
      const delRes=await deleteAuthor(server, tokenSuperAdmin, authorID);
  });

  it('отклонение автора администратором', async () => {
    // создаем автора повторно еще раз (пользователь)
    const resCopy3 = await createAuthor(server, tokenUser, authorsToAdd[0]);
    authorID = resCopy3.body.id;
    // посылаем запрос на "к модерации" (пользователь)
    const resModerate3 = await toModerateAuthor(server, tokenUser, resCopy3.body.id);
    // модерируем автора (админ)
    const resModerateAdmin2 = await moderateAuthor(server, tokenAdmin, resCopy3.body.id, 'reject','test note');
    // проверяем, что запрет прошёл успешно
    const findRes3 = await findAuthors(server, tokenSuperAdmin, authorsToAdd[0]);
    expect(findRes3.body.length).toBe(1);
    expect(findRes3.body[0].verification_status).toBe(VerificationStatus.Rejected);
    expect(findRes3.body[0].moderation_notes).toBe('test note');
  });

  it('удаление автора суперадмином', async () => {
      const delRes=await deleteAuthor(server, tokenSuperAdmin, authorID);
  });

}); 
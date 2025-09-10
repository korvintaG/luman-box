import { NestExpressApplication } from '@nestjs/platform-express';

import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import {
  sourceTestHelper,
} from './source.helper';
import { checkPhoto, checkPhotoAbsent, uploadPhoto } from 'src/files/tests/files.helpers';
import { setupTestApp } from 'src/test/tests.helpers';
import { StatusCode } from 'src/types/custom';
import { authorTestHelper } from 'src/DDD/authors/tests/author.helper';


describe('SourcesService (integration)', () => {
  let app: NestExpressApplication;
  let server: any;
  const entityToAddOK = 
  {
    name: 'Source name for test',
  }

  const authorToAddOK = 
  {
    name: 'Author name for test source',
  }

  const entityToAddBad = 
  {
    name: '',
  }

  let tokenUser: string;
  let tokenUser2: string;
  let tokenAdmin: string;
  let tokenSuperAdmin: string;
  let entityID: number;
  let authorID: number;
  let entityImage: string;

  let entityToAddOKWithAuthor: any;


  beforeAll(async () => {
    ({ app, server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin } = await setupTestApp());
    sourceTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    authorTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('анонимное чтение списка источников', async () => {
    await sourceTestHelper.getAnonymous(2, [
      { name: 'id', type: 'number' }, 
      { name: 'name', type: 'string' }, 
      { name: 'author', type: 'object' }
    ]);
  });

  it('попытка создать источник без авторизации должна вернуть 401', async () => {
    await sourceTestHelper.createAnonymous(entityToAddOK);
  });

  it('подготовка данных для тестов - удаление старых данных и добавление нового автора', async () => {
    await sourceTestHelper.removeOldData(entityToAddOK);
    await authorTestHelper.removeOldData(authorToAddOK);
    authorID = await authorTestHelper.createEntityAndCheck(authorToAddOK);
    //await authorTestHelper.simpleToModerate(tokenUser, authorID);
    //await authorTestHelper.simpleModerate(tokenAdmin, authorID, 'approve');
    entityToAddOKWithAuthor = { ...entityToAddOK, author: {id: authorID } };
  });

  it('попытка создания невалидного источника пользователем должна вернуть 400', async () => {
    const res = await sourceTestHelper.simpleCreate(tokenUser, entityToAddBad, StatusCode.BadRequest);
  });

  it('попытка создать источник с просроченным и плохим токеном должна вернуть 401', async () => {
    await sourceTestHelper.createWithBadTokens(entityToAddOKWithAuthor);
  });

  it('создание источника пользователем', async () => {
    entityID = await sourceTestHelper.createEntityAndCheck(entityToAddOKWithAuthor);
  });

  it('попытка модификация источника другим пользователем должна вернуть 401', async () => {
    await sourceTestHelper.updateByAnotherUser(entityID);
  }); 

  it('попытка модификации источника невалидными данными должна вернуть 400', async () => {
    await sourceTestHelper.updateByBadData( entityID, { name: '1' });
  });

  it('модификация источника пользователем', async () => {
    await sourceTestHelper.updateEntity( entityID, { about_source: 'test about source' });
  });

  it('загрузка фото источника пользователем', async () => {
    entityImage = await sourceTestHelper.uploadPhotoAndSet( entityID, process.env.SOURCE_PHOTO as string);
  });

  it('попытка создать источник-копии пользователем должна вернуть 500', async () => {
      const resCopy = await sourceTestHelper.simpleCreate(tokenUser, entityToAddOKWithAuthor, StatusCode.InternalServerError);
  });

  it('удаление источника пользователем', async () => {
      const delRes=await sourceTestHelper.simpleRemove(tokenUser, entityID);
  });

  it('проверка удаления фото при удалении источника пользователем', async () => {
    await checkPhotoAbsent(server, entityImage);
  });

   it('добавления нового источника пользователем сразу с фото', async () => {
     ({ entityID: entityID , image_URL: entityImage} = await sourceTestHelper.createEntityWithPhoto(
        entityToAddOKWithAuthor, process.env.SOURCE_PHOTO as string));
  });

  it('публикация источника пользователем, автоматом должен опубликоваться автор', async () => {
    // посылаем запрос на "к модерации" (пользователь)
    const resModerate = await sourceTestHelper.simpleToModerate(tokenUser, entityID);
    const resAuthor = await authorTestHelper.simpleFind(tokenSuperAdmin, {id: authorID});
    expect(resAuthor.body[0].verification_status).toBe(VerificationStatus.ToModerate);
  });

  it('попытка удалить источник пользователем после публикации должна вернуть 401', async () => {
      const delRes=await sourceTestHelper.simpleRemove(tokenUser, entityID, StatusCode.Unauthorized);
  });

  it('попытка публикации пользователем источника после публикации вернуть ошибку 400', async () => {
      const resModerate2 = await sourceTestHelper.simpleToModerate(tokenUser, entityID, StatusCode.BadRequest);
  });

  it('модерация источника администратором', async () => {
      await sourceTestHelper.simpleModerate(tokenAdmin, entityID, 'approve', '', StatusCode.BadRequest); // ошибка т.к. автор непроверен
      await authorTestHelper.simpleModerate(tokenAdmin, authorID, 'approve');
      await sourceTestHelper.moderateApprove( entityID, 'approve');
  }); 

  it('попытка удалить источник администратором после модерации должна вернуть 401', async () => {
      const delRes=await sourceTestHelper.simpleRemove(tokenAdmin, entityID, StatusCode.Unauthorized);
  });

  it('удаление источника суперадмином', async () => {
      const delRes=await sourceTestHelper.simpleRemove(tokenSuperAdmin, entityID);
  });

  it('отклонение источника администратором', async () => {
    entityID = await sourceTestHelper.moderateReject(entityToAddOKWithAuthor);
  });

  it('проверка невозможности удаления связанного с источником автора', async () => {
    const delRes=await authorTestHelper.simpleRemove( tokenSuperAdmin, authorID, StatusCode.BadRequest);
  });

  it('удаление источника и автора суперадмином', async () => {
      const delRes=await sourceTestHelper.simpleRemove( tokenSuperAdmin, entityID);
      const delRes2=await authorTestHelper.simpleRemove( tokenSuperAdmin, authorID);
  });

}); 
import { NestExpressApplication } from '@nestjs/platform-express';

import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import {
  authorTestHelper,
} from './author.helper';
import { checkPhoto, checkPhotoAbsent, uploadPhoto } from 'src/files/tests/files.helpers';
import { setupTestApp } from 'src/test/tests.helpers';
import { StatusCode } from 'src/types/custom';


describe('AuthorsService (integration)', () => {
  let app: NestExpressApplication;
  let server: any;
  const entityToAddOK = 
  {
    name: 'Added by User',
    birth_date: '1990-01-01',
  }

  const entityToAddBad = 
  {
    name: '',
    birth_date: '1990-01-01', 
  }

  let tokenUser: string;
  let tokenUser2: string;
  let tokenAdmin: string;
  let tokenSuperAdmin: string;
  let entityID: number;
  let entityImage: string;



  beforeAll(async () => {
    ({ app, server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin } = await setupTestApp());
    authorTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
  });

  afterAll(async () => {
    await app?.close();
  });


  it('анонимное чтение списка авторов', async () => {
    await authorTestHelper.getAnonymous(5, [{ name: 'id', type: 'number' }, { name: 'name', type: 'string' }]);
  });

  it('попытка создать автора без авторизации должна вернуть 401', async () => {
    await authorTestHelper.createAnonymous(entityToAddOK);
  });

  it('удаление старого мусора с авторами если остался таковой', async () => {
    await authorTestHelper.removeOldData(entityToAddOK);
  });

  it('попытка создания невалидного автора пользователем должна вернуть 400', async () => {
    const res = await authorTestHelper.simpleCreate(tokenUser, entityToAddBad, StatusCode.BadRequest);
  });

  it('создание автора пользователем', async () => {
    entityID = await authorTestHelper.createEntityAndCheck( entityToAddOK);
  });

  it('попытка создать автора с просроченным и плохим токеном должна вернуть 401', async () => {
    await authorTestHelper.createWithBadTokens(entityToAddOK);
  });

  it('попытка модификация автора другим пользователем должна вернуть 401', async () => {
    await authorTestHelper.updateByAnotherUser(entityID);
  }); 

  it('попытка модификации автора невалидными данными должна вернуть 400', async () => {
    await authorTestHelper.updateByBadData( entityID, { name: '1' });
  });

  it('модификация автора пользователем', async () => {
    await authorTestHelper.updateEntity( entityID, { about_author: 'test about author' });
  });

  it('загрузка фото автора пользователем', async () => {
    entityImage = await authorTestHelper.uploadPhotoAndSet( entityID, process.env.AUTHOR_PHOTO as string);
  });

  it('попытка создать автора-копии пользователем должна вернуть 500', async () => {
      const resCopy = await authorTestHelper.simpleCreate(tokenUser, entityToAddOK, StatusCode.InternalServerError);
  });

  it('удаление автора пользователем', async () => {
      const delRes=await authorTestHelper.simpleRemove(tokenUser, entityID);
  });

  it('проверка удаления фото при удалении автора пользователем', async () => {
    await checkPhotoAbsent(server, entityImage);
  });

  it('добавления нового автора пользователем сразу с фото', async () => {
     ({ entityID: entityID , image_URL: entityImage} = await authorTestHelper.createEntityWithPhoto(
        entityToAddOK, process.env.AUTHOR_PHOTO as string));
  });

  it('публикация автора пользователем', async () => {
    // посылаем запрос на "к модерации" (пользователь)
    const resModerate = await authorTestHelper.simpleToModerate(tokenUser, entityID);
  });

  it('попытка удалить автора пользователем после публикации должна вернуть 401', async () => {
      const delRes=await authorTestHelper.simpleRemove(tokenUser, entityID, StatusCode.Unauthorized);
  });

  it('попытка публикации пользователем автора после публикации вернуть ошибку 400', async () => {
      const resModerate2 = await authorTestHelper.simpleToModerate(tokenUser, entityID, StatusCode.BadRequest);
  });

  it('модерация автора администратором', async () => {
      await authorTestHelper.moderateApprove( entityID, 'approve');
  }); 

  it('попытка удалить автора администратором после модерации должна вернуть 401', async () => {
      const delRes=await authorTestHelper.simpleRemove(tokenAdmin, entityID, StatusCode.Unauthorized);
  });

  it('удаление автора суперадмином', async () => {
      const delRes=await authorTestHelper.simpleRemove(tokenSuperAdmin, entityID);
  });

  it('отклонение автора администратором', async () => {
    entityID = await authorTestHelper.moderateReject(entityToAddOK);
  });

  it('удаление автора суперадмином', async () => {
      const delRes=await authorTestHelper.simpleRemove( tokenSuperAdmin, entityID);
  });

}); 
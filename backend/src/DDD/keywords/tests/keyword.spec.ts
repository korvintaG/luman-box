import { NestExpressApplication } from '@nestjs/platform-express';

import {
  keywordTestHelper,
} from './keyword.helper';
import { setupTestApp } from 'src/test/tests.helpers';
import { StatusCode } from 'src/types/custom';

const keywordToAddOK = 
  {
    name: 'Added_by_User'
  };

const keywordToAddBad = 
  {
    name: ''
  };

let tokenUser: string;
let tokenUser2: string;
let tokenAdmin: string;
let tokenSuperAdmin: string;
let keywordID: number;


describe('KeywordsService (integration)', () => {
  let app: NestExpressApplication;
  let server: any;

  beforeAll(async () => {
    ({ app, server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin } = await setupTestApp());
    keywordTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
  });

  afterAll(async () => { 
    await app?.close();
  });

  it('анонимное чтение списка ключевых слов', async () => {
    await keywordTestHelper.getAnonymous(15, 
      [{ name: 'id', type: 'number' }, { name: 'name', type: 'string' }]);
  });

  it('попытка создать ключевое слово без авторизации должна вернуть 401', async () => {
    await keywordTestHelper.createAnonymous(keywordToAddOK);
  });

  it('удаление старого мусора с ключевыми словами если остался таковой', async () => {
    await keywordTestHelper.removeOldData(keywordToAddOK);
  });

  it('попытка создания невалидного автора пользователем должна вернуть 400', async () => {
    const res = await keywordTestHelper.simpleCreate(tokenUser, keywordToAddBad, StatusCode.BadRequest);
  });
  
  it('создание ключевого слова пользователем', async () => {
    keywordID = await keywordTestHelper.createEntityAndCheck(keywordToAddOK);
  });

  it('попытка создать ключевое слово с просроченным и плохим токеном должна вернуть 401', async () => {
    await keywordTestHelper.createWithBadTokens( keywordToAddOK);
  });

  it('попытка модификация ключевого слова другим пользователем должна вернуть 401', async () => {
    await keywordTestHelper.updateByAnotherUser(keywordID);
  }); 

  it('попытка модификации ключевого слова невалидными данными должна вернуть 400', async () => {
    await keywordTestHelper.updateByBadData( keywordID, { name: '' });
  });

  it('модификация ключевого слова пользователем', async () => {
    await keywordTestHelper.updateEntity( keywordID, { definition: 'test definition' });
  });

  it('попытка создать ключевое слово-копии пользователем должна вернуть 500', async () => {
    // создаем такого же автора, должна быть ошибка уникальности (пользователь)
    const resCopy = await keywordTestHelper.simpleCreate(tokenUser, keywordToAddOK, StatusCode.InternalServerError);
  });

  it('удаление ключевого слова пользователем', async () => {
    const delRes=await keywordTestHelper.simpleRemove(tokenUser, keywordID); 
  });

  it('публикация ключевого слова пользователем', async () => {
    // посылаем запрос на "к модерации" (пользователь)
    keywordID = await keywordTestHelper.createEntityAndCheck(keywordToAddOK);
    const resModerate = await keywordTestHelper.simpleToModerate(tokenUser, keywordID);
  });

  it('попытка удалить ключевое слово пользователем после публикации должна вернуть 401', async () => {
      const delRes=await keywordTestHelper.simpleRemove(tokenUser, keywordID, StatusCode.Unauthorized);
  });

  it('попытка публикации пользователем ключевого слова после публикации вернуть ошибку 400', async () => {
      const resModerate2 = await keywordTestHelper.simpleToModerate( tokenUser, keywordID, StatusCode.BadRequest);
  });

  it('модерация ключевого слова администратором', async () => {
      await keywordTestHelper.moderateApprove( keywordID, 'approve');
  }); 

  it('попытка удалить ключевое слово администратором после модерации должна вернуть 401', async () => {
      const delRes=await keywordTestHelper.simpleRemove( tokenAdmin, keywordID, StatusCode.Unauthorized);
  });

  it('удаление ключевого слова суперадмином', async () => {
      const delRes=await keywordTestHelper.simpleRemove( tokenSuperAdmin, keywordID);
  });

  it('отклонение ключевого слова администратором', async () => {
    keywordID = await keywordTestHelper.moderateReject(keywordToAddOK);
  });

  it('удаление ключевого слова суперадмином', async () => {
      const delRes=await keywordTestHelper.simpleRemove( tokenSuperAdmin, keywordID);
  });
  

}); 
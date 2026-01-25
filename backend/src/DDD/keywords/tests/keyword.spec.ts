import { NestExpressApplication } from '@nestjs/platform-express';

import {
  keywordTestHelper,
} from './keyword.helper';
import { setupTestApp } from 'src/test/tests.helpers';
import { StatusCode } from 'src/types/custom';
import { Keyword, KeywordName } from '../entities/keyword.entity';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';

const keywordToAddOK = 
{
  class_keyword_id: 0,
  names: ["Первое тест","Второе тест"],
  default_name_index: 0
};

const keywordToAddBad = 
  {
    names: ['']
  };

const newSynonym = 'Новый синоним';

let tokenUser: string;
let tokenUser2: string;
let tokenAdmin: string;
let tokenSuperAdmin: string;
let keyword: Keyword;
let keywordID: number;
let keywordModerationID: number;


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
    await keywordTestHelper.getAnonymous(5);
  });

  it('попытка создать ключевое слово без авторизации должна вернуть 401', async () => {
    await keywordTestHelper.createAnonymous(keywordToAddOK);
  });

  it('удаление старого мусора с ключевыми словами если остался таковой', async () => {
    await keywordTestHelper.removeOldData({
      name: keywordToAddOK.names[0], 
      class_keyword_id: keywordToAddOK.class_keyword_id
    });
  });

  it('попытка создания невалидного ключевого слова пользователем должна вернуть 400', async () => {
    const res = await keywordTestHelper.simpleCreate(tokenUser, keywordToAddBad, StatusCode.BadRequest);
  });
  
  it('попытка создания ключевого слова админом должна вернуть 403', async () => {
    const res = await keywordTestHelper.simpleCreate(tokenAdmin, keywordToAddOK, StatusCode.Forbidden);
  });

  it('попытка создания ключевого слова суперадмином должна вернуть 403', async () => {
    const res = await keywordTestHelper.simpleCreate(tokenSuperAdmin, keywordToAddOK, StatusCode.Forbidden);
  });
  
  it('создание ключевого слова пользователем', async () => {
    keyword = await keywordTestHelper.createKeywordAndCheck(keywordToAddOK);

  });

  it('попытка создать ключевое слово с просроченным и плохим токеном должна вернуть 401', async () => {
    await keywordTestHelper.createWithBadTokens( keywordToAddOK);
  });

  it('попытка модификация ключевого слова другим пользователем должна вернуть 401', async () => {
    await keywordTestHelper.updateByAnotherUser(keyword.id);
  }); 

  it('попытка модификации ключевого слова невалидными данными должна вернуть 400', async () => {
    await keywordTestHelper.updateByBadData( keyword.id, { names: [''] });
  });

  it('модификация ключевого слова пользователем', async () => {
    await keywordTestHelper.updateEntity( keyword.id, { definition: 'test definition' });
  });

  it('попытка создать ключевое слово-копии пользователем должна вернуть 500', async () => {
    // создаем такого же автора, должна быть ошибка уникальности (пользователь)
    const resCopy = await keywordTestHelper.simpleCreate(tokenUser, keywordToAddOK, StatusCode.InternalServerError);
  });

  it('удаление ключевого слова пользователем', async () => {
    const delRes=await keywordTestHelper.simpleRemove(tokenUser, keyword.id); 
  });

  it('публикация ключевого слова пользователем', async () => {
    // посылаем запрос на "к модерации" (пользователь)
    keyword = await keywordTestHelper.createKeywordAndCheck(keywordToAddOK);
    const resModerate = await keywordTestHelper.simpleToModerate(tokenUser, keyword.id);
  });

  it('попытка удалить ключевое слово пользователем после публикации должна вернуть 401', async () => {
      const delRes=await keywordTestHelper.simpleRemove(tokenUser, keyword.id, StatusCode.Unauthorized);
  });

  it('попытка публикации пользователем ключевого слова после публикации вернуть ошибку 400', async () => {
      const resModerate2 = await keywordTestHelper.simpleToModerate( tokenUser, keyword.id, StatusCode.BadRequest);
  });

  it('модерация ключевого слова администратором', async () => {
      await keywordTestHelper.moderateApprove( keyword.id, 'approve');
  }); 

  it('добавлене нового синонима ключевого слова другим пользователем', async () => {
    await keywordTestHelper.simpleUpdate(tokenUser2, keyword.id, { names: [...keyword.names, {name: newSynonym}] });
  }); 

  it('публикация ключевого слова другим пользователем', async () => {
    const resModerate = await keywordTestHelper.simpleToModerate(tokenUser2, keyword.id);
    keywordModerationID = resModerate.body.keyword_moderation_id;
  });

  it('модерация ключевого слова администратором от второго пользователя', async () => {
    await keywordTestHelper.moderateApprove( keyword.id, 'approve', '', keywordModerationID);
  }); 

  it('Проверка что новый синоним добавлен и прошел модерацию', async () => {
    const findRes = await keywordTestHelper.simpleFind(tokenSuperAdmin, {id: keyword.id});
    console.log('findRes: ', findRes.body);
    expect(findRes.body.length).toBe(1);
    expect(findRes.body[0].names.length).toBe(keyword.names.length + 1);
    const newSynonymObj=findRes.body[0].names.find((el: KeywordName)=>el.name===newSynonym);
    expect(newSynonymObj).toBeDefined();
    expect(newSynonymObj.verification_status).toBe(VerificationStatus.Moderated);
  });

  it('попытка удалить ключевое слово администратором после модерации должна вернуть 401', async () => {
      const delRes=await keywordTestHelper.simpleRemove( tokenAdmin, keyword.id, StatusCode.Unauthorized);
  });

  it('удаление ключевого слова суперадмином', async () => {
      const delRes=await keywordTestHelper.simpleRemove( tokenSuperAdmin, keyword.id);
  });

  it('отклонение ключевого слова администратором', async () => {
    keywordID = await keywordTestHelper.moderateReject(keywordToAddOK);
  });

  it('удаление ключевого слова суперадмином', async () => {
      const delRes=await keywordTestHelper.simpleRemove( tokenSuperAdmin, keywordID);
  });
  

}); 
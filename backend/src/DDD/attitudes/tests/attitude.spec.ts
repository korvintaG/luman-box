import { NestExpressApplication } from '@nestjs/platform-express';

import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import {
  attitudeTestHelper,
} from './attitude.helper';
import { checkPhoto, checkPhotoAbsent, uploadPhoto } from 'src/files/tests/files.helpers';
import { setupTestApp } from 'src/test/tests.helpers';
import { StatusCode } from 'src/types/custom';
import { authorTestHelper } from 'src/DDD/authors/tests/author.helper';
import { sourceTestHelper } from 'src/DDD/sources/tests/source.helper';
import { keywordTestHelper } from 'src/DDD/keywords/tests/keyword.helper';
import { ideaTestHelper } from 'src/DDD/ideas/tests/idea.helper';
import { Keyword } from 'src/DDD/keywords/entities/keyword.entity';


describe('AttitudesService (integration)', () => {
  let app: NestExpressApplication;
  let server: any;
  const entityToAddOK = 
  {
    idea_id  : 1,
    like : 1,
    importance : 1,
    user_id : 1
  }

  const keywordToAddOK = { 
    names: ['Keyword name for test idea', 'Keyword name for test idea 2'],
    default_name_index: 0,
    class_keyword_id: 0
  }

  const ideaToAddOK = {
    name: 'Idea name for test attitude',
    original_text: 'Original text for test idea and many words and many words and many words',
    content: 'Content for test idea and many words and many words and many words',
  }

  const sourceToAddOK = 
  {
    name: 'Source name for test',
  }

  const authorToAddOK = 
  {
    name: 'Author name for test source',
  }

  const entityToAddBad = 
  {
    idea_id  : 1,
    like : 100,
    importance : 1,
  }

  let tokenUser: string;
  let tokenUser2: string;
  let tokenAdmin: string;
  let tokenSuperAdmin: string;
  let entityID: number;
  let authorID: number;
  let sourceID: number;
  let keyword: Keyword;
  let ideaID: number;

  let entityToAddOKWithAll: any;


  beforeAll(async () => {
    ({ app, server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin } = await setupTestApp());
    attitudeTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    sourceTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    authorTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    keywordTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    ideaTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('попытка создать отношение без авторизации должна вернуть 401', async () => {
    await attitudeTestHelper.simpleAttitude('', 1, entityToAddOK, StatusCode.Unauthorized);
  });

  it('попытка создать отношение без id идеи должна вернуть 404', async () => {
    await attitudeTestHelper.simpleAttitude(tokenUser, null, entityToAddOK, StatusCode.NotFound);
  });

  it('попытка создать отношение с несуществующим id идеи должна вернуть 404', async () => {
    await attitudeTestHelper.simpleAttitude(tokenUser, 1, entityToAddOK, StatusCode.NotFound);
  });



  it('подготовка данных для тестов - удаление старых данных и добавление новоых автора, идеи, ключевого слова, источника', async () => {
    await ideaTestHelper.removeOldData(ideaToAddOK);
    await keywordTestHelper.removeOldData({
      name: keywordToAddOK.names[0], 
      class_keyword_id: keywordToAddOK.class_keyword_id
    });
    await sourceTestHelper.removeOldData(sourceToAddOK);
    await authorTestHelper.removeOldData(authorToAddOK);
    authorID = await authorTestHelper.createEntityAndCheck(authorToAddOK);
    const sourceToAddOKWithAuthor = { ...sourceToAddOK, author: {id: authorID } };
    sourceID = await sourceTestHelper.createEntityAndCheck(sourceToAddOKWithAuthor);
    keyword = await keywordTestHelper.createKeywordAndCheck(keywordToAddOK);
    const ideaToAddOKWithSource = { ...ideaToAddOK, source: {id: sourceID }, keyword_names:  [{id: keyword.names[0].id }]  };
    ideaID = await ideaTestHelper.createEntityAndCheck(ideaToAddOKWithSource);
    entityToAddOKWithAll = { ...entityToAddOK, idea_id: ideaID };
  });

  it('попытка создания невалидного отношения пользователем должна вернуть 400', async () => {
    await attitudeTestHelper.simpleAttitude(tokenUser, ideaID, entityToAddBad, StatusCode.BadRequest);
  });

  it('попытка создать отношение с просроченным и плохим токеном должна вернуть 401', async () => {
    await attitudeTestHelper.attitudeWithBadTokens(ideaID, entityToAddOKWithAll);
  });

  it('создание отношения пользователем', async () => {
    const res = await attitudeTestHelper.simpleAttitude(tokenUser, ideaID, entityToAddOKWithAll, StatusCode.successCreate);
  });

  it('проверка создания отношения пользователем', async () => {
    const res = await attitudeTestHelper.simpleAttitudeFind(tokenUser, ideaID);
    //console.log('проверка создания отношения пользователем res.body', res.body);
    expect(res.body.user.like).toBe(entityToAddOKWithAll.like);
    expect(res.body.user.importance).toBe(entityToAddOKWithAll.importance);
    expect(res.body.user.truth).toBe(0);
    expect(res.body.all.like).toEqual([0,1,0,0,0]);
    expect(res.body.all.importance).toEqual([0,1,0,0,0]);
    expect(res.body.all.truth).toEqual([0,0,0,0,0]);
  });

  it('модификация отношения другим пользователем ', async () => {
    await attitudeTestHelper.simpleAttitude(tokenUser2, ideaID, entityToAddOKWithAll);
    const res = await attitudeTestHelper.simpleAttitudeFind(tokenUser2, ideaID);
    expect(res.body.user.like).toBe(entityToAddOKWithAll.like);
    expect(res.body.user.importance).toBe(entityToAddOKWithAll.importance);
    expect(res.body.user.truth).toBe(0);
    expect(res.body.all.like).toEqual([0,2,0,0,0]);
    expect(res.body.all.importance).toEqual([0,2,0,0,0]);
    expect(res.body.all.truth).toEqual([0,0,0,0,0]);
  }); 

  
  it('модификация отношения пользователем', async () => {
    const entityToAddOKWithAll2 = { ...entityToAddOKWithAll, like: 2, importance: 2 };
    await attitudeTestHelper.simpleAttitude(tokenUser, ideaID, entityToAddOKWithAll2, StatusCode.successUpdate);
    const res = await attitudeTestHelper.simpleAttitudeFind(tokenUser, ideaID);
    expect(res.body.user.like).toBe(entityToAddOKWithAll2.like);
    expect(res.body.user.importance).toBe(entityToAddOKWithAll2.importance);
    expect(res.body.user.truth).toBe(0);
    expect(res.body.all.like).toEqual([0,1,1,0,0]);
    expect(res.body.all.importance).toEqual([0,1,1,0,0]);
    expect(res.body.all.truth).toEqual([0,0,0,0,0]);
  });

  it('сброс отношения пользователем', async () => {
    const delRes=await attitudeTestHelper.simpleAttitude(tokenUser, ideaID, 
        { ...entityToAddOKWithAll, like: 0, importance: 0 } , StatusCode.successDelete);
    const res = await attitudeTestHelper.simpleAttitudeFind(tokenUser, ideaID);
    expect(res.body.user.like).toBe(0);
    expect(res.body.user.importance).toBe(0);
    expect(res.body.user.truth).toBe(0);
    expect(res.body.all.like).toEqual([0,1,0,0,0]);
    expect(res.body.all.importance).toEqual([0,1,0,0,0]);
    expect(res.body.all.truth).toEqual([0,0,0,0,0]);
  });
   
  it('удаление автора, источника, ключевого слова, идей суперадмином', async () => {
    const delRes3=await ideaTestHelper.simpleRemove( tokenSuperAdmin, ideaID);
    const delRes=await sourceTestHelper.simpleRemove( tokenSuperAdmin, sourceID);
    const delRes2=await keywordTestHelper.simpleRemove( tokenSuperAdmin, keyword.id);
    const delRes5=await authorTestHelper.simpleRemove( tokenSuperAdmin, authorID);
  });

}); 
import { NestExpressApplication } from '@nestjs/platform-express';

import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import {
  interconnectionTestHelper,
} from './interconnection.helper';
import { setupTestApp } from 'src/test/tests.helpers';
import { StatusCode } from 'src/types/custom';
import { authorTestHelper } from 'src/DDD/authors/tests/author.helper';
import { sourceTestHelper } from 'src/DDD/sources/tests/source.helper';
import { keywordTestHelper } from 'src/DDD/keywords/tests/keyword.helper';
import { ideaTestHelper } from 'src/DDD/ideas/tests/idea.helper';


describe('InterconnectionsService (integration)', () => {
  let app: NestExpressApplication;
  let server: any;
  const entityToAddOK = 
  {
    interconnection_type  : 1,
    name_direct : "Название сути связи прямое для теста",
    name_reverse : "Название сути связи обратное для теста"
  }

  const keywordToAddOK = {
    name: 'Keyword name for test idea',
  }

  const idea1ToAddOK = {
    name: 'Idea 1 name for test interconnection',
    original_text: 'Original 1 1 1 1 1 text for test idea and many words and many words and many words',
    content: 'Content 1 1 1 1 1 1 1 1 for test idea and many words and many words and many words',
  }

  const idea2ToAddOK = {
    name: 'Idea 2 name for test interconnection',
    original_text: 'Original 2 2 2 2 2 text for test idea and many words and many words and many words',
    content: 'Content 2 2 2 2 2 2 2 2 for test idea and many words and many words and many words',
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
    interconnection_type  : 1,
    name_direct : "Название сути связи прямое для теста",
    name_reverse : ""
  }

  let tokenUser: string;
  let tokenUser2: string;
  let tokenAdmin: string;
  let tokenSuperAdmin: string;
  let entityID: number;
  let authorID: number;
  let sourceID: number;
  let keywordID: number;
  let idea1ID: number;
  let idea2ID: number;

  let entityToAddOKWithAll: any;


  beforeAll(async () => {
    ({ app, server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin } = await setupTestApp());
    interconnectionTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    sourceTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    authorTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    keywordTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    ideaTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('попытка создать связь без авторизации должна вернуть 401', async () => {
    await interconnectionTestHelper.createAnonymous(entityToAddOK);
  });

  it('подготовка данных для тестов - удаление старых данных и добавление новоых автора, идеи, ключевого слова, источника', async () => {
    await interconnectionTestHelper.removeOldData(entityToAddOK);
    await ideaTestHelper.removeOldData(idea1ToAddOK);
    await ideaTestHelper.removeOldData(idea2ToAddOK);
    await keywordTestHelper.removeOldData(keywordToAddOK);
    await sourceTestHelper.removeOldData(sourceToAddOK);
    await authorTestHelper.removeOldData(authorToAddOK);
    authorID = await authorTestHelper.createEntityAndCheck(authorToAddOK);
    const sourceToAddOKWithAuthor = { ...sourceToAddOK, author: {id: authorID } };
    sourceID = await sourceTestHelper.createEntityAndCheck(sourceToAddOKWithAuthor);
    keywordID = await keywordTestHelper.createEntityAndCheck(keywordToAddOK);
    const idea1ToAddOKWithSource = { ...idea1ToAddOK, source: {id: sourceID }, keywords: [{id: keywordID }] };
    idea1ID = await ideaTestHelper.createEntityAndCheck(idea1ToAddOKWithSource);
    const idea2ToAddOKWithSource = { ...idea2ToAddOK, source: {id: sourceID }, keywords: [{id: keywordID }] };
    idea2ID = await ideaTestHelper.createEntityAndCheck(idea2ToAddOKWithSource);
    entityToAddOKWithAll = { ...entityToAddOK, idea1_id: idea1ID, idea2_id: idea2ID };
  });

  it('попытка создания невалидной связи пользователем должна вернуть 400', async () => {
    const res = await interconnectionTestHelper.simpleCreate(tokenUser, entityToAddBad, StatusCode.BadRequest);
  });

  it('попытка создать связь с просроченным и плохим токеном должна вернуть 401', async () => {
    await interconnectionTestHelper.createWithBadTokens(entityToAddOK);
  });

  it('создание связи пользователем', async () => {
    entityID = await interconnectionTestHelper.createEntityAndCheck(entityToAddOKWithAll);
  });

  it('попытка модификация связи другим пользователем должна вернуть 401', async () => {
    await interconnectionTestHelper.updateByAnotherUser(entityID);
  }); 

  it('попытка модификации связи невалидными данными должна вернуть 400', async () => {
    await interconnectionTestHelper.updateByBadData( entityID, { name_direct: '' });
  });

  it('модификация связи пользователем', async () => {
    await interconnectionTestHelper.updateEntity( entityID, { name_direct: entityToAddOKWithAll.name_direct });
  });

  it('попытка создать связь-копии пользователем должна вернуть 500', async () => {
    const resCopy = await interconnectionTestHelper.simpleCreate(tokenUser, entityToAddOKWithAll, StatusCode.InternalServerError);
  });

  it('удаление связи пользователем', async () => {
    const delRes=await interconnectionTestHelper.simpleRemove(tokenUser, entityID);
  });

  it('повторное создание связи пользователем', async () => {
    entityID = await interconnectionTestHelper.createEntityAndCheck(entityToAddOKWithAll);
  });
  
  it('публикация связи пользователем, автоматом должен опубликоваться идеи, автор, источник, ключевое слово', async () => {
    // посылаем запрос на "к модерации" (пользователь)
    const resModerate = await interconnectionTestHelper.simpleToModerate(tokenUser, entityID);
    const resIdea = await ideaTestHelper.simpleFind(tokenSuperAdmin, {id: idea1ID});
    expect(resIdea.body[0].verification_status).toBe(VerificationStatus.ToModerate);
    const resIdea2 = await ideaTestHelper.simpleFind(tokenSuperAdmin, {id: idea2ID});
    expect(resIdea2.body[0].verification_status).toBe(VerificationStatus.ToModerate);
    const resSource = await sourceTestHelper.simpleFind(tokenSuperAdmin, {id: sourceID});
    expect(resSource.body[0].verification_status).toBe(VerificationStatus.ToModerate);
    const resKeyword = await keywordTestHelper.simpleFind(tokenSuperAdmin, {id: keywordID});
    expect(resKeyword.body[0].verification_status).toBe(VerificationStatus.ToModerate);
    const resAuthor = await authorTestHelper.simpleFind(tokenSuperAdmin, {id: authorID});
    expect(resAuthor.body[0].verification_status).toBe(VerificationStatus.ToModerate);
  });

  it('попытка удалить связь пользователем после публикации должна вернуть 401', async () => {
      const delRes=await interconnectionTestHelper.simpleRemove(tokenUser, entityID, StatusCode.Unauthorized);
  });

  it('попытка публикации пользователем связи после публикации вернуть ошибку 400', async () => {
      const resModerate2 = await interconnectionTestHelper.simpleToModerate(tokenUser, entityID, StatusCode.BadRequest);
  });

  it('модерация связи администратором', async () => {
      await interconnectionTestHelper.simpleModerate(tokenAdmin, entityID, 'approve', '', StatusCode.BadRequest); // ошибка т.к. автор непроверены
      await authorTestHelper.simpleModerate(tokenAdmin, authorID, 'approve');
      await interconnectionTestHelper.simpleModerate(tokenAdmin, entityID, 'approve', '', StatusCode.BadRequest); // ошибка т.к. источник непроверены
      await sourceTestHelper.simpleModerate(tokenAdmin, sourceID, 'approve');
      await interconnectionTestHelper.simpleModerate(tokenAdmin, entityID, 'approve', '', StatusCode.BadRequest); // ошибка т.к. ключевое слово непроверены
      await keywordTestHelper.simpleModerate(tokenAdmin, keywordID, 'approve');
      await interconnectionTestHelper.simpleModerate(tokenAdmin, entityID, 'approve', '', StatusCode.BadRequest); // ошибка т.к. идеи непроверены
      await ideaTestHelper.simpleModerate(tokenAdmin, idea1ID, 'approve');
      await ideaTestHelper.simpleModerate(tokenAdmin, idea2ID, 'approve');
      await interconnectionTestHelper.moderateApprove( entityID, 'approve');
  }); 

  it('попытка удалить связь администратором после модерации должна вернуть 401', async () => {
      const delRes=await interconnectionTestHelper.simpleRemove(tokenAdmin, entityID, StatusCode.Unauthorized);
  });

  it('удаление связи суперадмином', async () => {
      const delRes=await interconnectionTestHelper.simpleRemove(tokenSuperAdmin, entityID);
  });

  it('отклонение связи администратором', async () => {
    entityID = await interconnectionTestHelper.moderateReject(entityToAddOKWithAll);
  });

  it('проверка невозможности удаления связанного со связью автора, идеи, источника, ключевого слова', async () => {
    const delRes=await authorTestHelper.simpleRemove( tokenSuperAdmin, authorID, StatusCode.BadRequest);
    const delRes2=await ideaTestHelper.simpleRemove( tokenSuperAdmin, idea1ID, StatusCode.BadRequest);
    const delRes3=await ideaTestHelper.simpleRemove( tokenSuperAdmin, idea2ID, StatusCode.BadRequest);
    const delRes4=await sourceTestHelper.simpleRemove( tokenSuperAdmin, sourceID, StatusCode.BadRequest);
    const delRes5=await keywordTestHelper.simpleRemove( tokenSuperAdmin, keywordID, StatusCode.BadRequest);
  });

  it('удаление автора, источника, ключевого слова, идей, связи между идеями суперадмином', async () => {
    const delRes6=await interconnectionTestHelper.simpleRemove( tokenSuperAdmin, entityID);
    const delRes3=await ideaTestHelper.simpleRemove( tokenSuperAdmin, idea1ID);
    const delRes4=await ideaTestHelper.simpleRemove( tokenSuperAdmin, idea2ID);
    const delRes=await sourceTestHelper.simpleRemove( tokenSuperAdmin, sourceID);
    const delRes2=await keywordTestHelper.simpleRemove( tokenSuperAdmin, keywordID);
    const delRes5=await authorTestHelper.simpleRemove( tokenSuperAdmin, authorID);
  });

}); 
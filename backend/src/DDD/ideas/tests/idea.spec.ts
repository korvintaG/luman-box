import { NestExpressApplication } from '@nestjs/platform-express';

import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import {
  ideaTestHelper,
} from './idea.helper';
import { checkPhoto, checkPhotoAbsent, uploadPhoto } from 'src/files/tests/files.helpers';
import { setupTestApp } from 'src/test/tests.helpers';
import { StatusCode } from 'src/types/custom';
import { authorTestHelper } from 'src/DDD/authors/tests/author.helper';
import { sourceTestHelper } from 'src/DDD/sources/tests/source.helper';
import { keywordTestHelper } from 'src/DDD/keywords/tests/keyword.helper';
import { Keyword } from 'src/DDD/keywords/entities/keyword.entity';


describe('SourcesService (integration)', () => {
  let app: NestExpressApplication;
  let server: any;
  const entityToAddOK = 
  {
    name: 'Idea name for test very long',
    original_text: 'Original text for test idea and many words and many words and many words',
    content: 'Content for test idea and many words and many words and many words',
  }

  const sourceToAddOK = 
  {
    name: 'Source name for test idea',
  }

  const authorToAddOK = 
  {
    name: 'Author name for test idea',
  }

  const keywordToAddOK = {
    names: ['Keyword name for test idea', 'Keyword name for test idea 2'],
    default_name_index: 0,
    class_keyword_id: 0
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
  let sourceID: number;
  let keyword: Keyword;
  const SVG='<svg id="Capa_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m512 27.667h-216c-15.75 0-29.964 6.665-40 17.31-10.036-10.645-24.25-17.31-40-17.31h-216v360.667h203.857v43.857c0 28.752 23.391 52.143 52.143 52.143s52.143-23.391 52.143-52.143v-43.857h203.857zm-30 330.666h-173.857v-27.169c19.108-8.77 35.649-22.2 48.156-38.831h84.201v-30h-67.512c4.153-10.705 6.874-22.117 7.934-34h59.578v-30h-60.473c-1.803-11.967-5.308-23.383-10.251-34h70.724v-30h-90.335c-19.888-22.6-47.76-38.007-79.165-41.767v-9.9c0-13.785 11.215-25 25-25h186zm-226 96c-12.21 0-22.143-9.933-22.143-22.143v-14.523h44.286v14.523c0 12.21-9.933 22.143-22.143 22.143zm-226-396.666h186c13.785 0 25 11.215 25 25v9.9c-31.404 3.76-59.277 19.166-79.165 41.767h-90.335v30h70.723c-4.943 10.617-8.448 22.033-10.251 34h-60.472v30h59.577c1.06 11.883 3.781 23.295 7.935 34h-67.512v30h84.2c12.507 16.631 29.048 30.062 48.156 38.831v27.169h-173.856zm321.431 159.431c0 52.621-42.81 95.431-95.431 95.431s-95.432-42.81-95.432-95.431 42.811-95.432 95.432-95.432 95.431 42.811 95.431 95.432zm-73.288 170.569h-44.286v-47.095c7.19 1.286 14.589 1.957 22.143 1.957s14.953-.672 22.143-1.957z"></path><path d="m217.666 217.098c0-21.137 17.196-38.333 38.334-38.333v-30c-37.679 0-68.334 30.654-68.334 68.333z"></path></g></svg>';
  const SVGNotes='<!-- icon666.com - MILLIONS OF FREE VECTOR ICONS --><svg id="Capa_1" enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m512 27.667h-216c-15.75 0-29.964 6.665-40 17.31-10.036-10.645-24.25-17.31-40-17.31h-216v360.667h203.857v43.857c0 28.752 23.391 52.143 52.143 52.143s52.143-23.391 52.143-52.143v-43.857h203.857zm-30 330.666h-173.857v-27.169c19.108-8.77 35.649-22.2 48.156-38.831h84.201v-30h-67.512c4.153-10.705 6.874-22.117 7.934-34h59.578v-30h-60.473c-1.803-11.967-5.308-23.383-10.251-34h70.724v-30h-90.335c-19.888-22.6-47.76-38.007-79.165-41.767v-9.9c0-13.785 11.215-25 25-25h186zm-226 96c-12.21 0-22.143-9.933-22.143-22.143v-14.523h44.286v14.523c0 12.21-9.933 22.143-22.143 22.143zm-226-396.666h186c13.785 0 25 11.215 25 25v9.9c-31.404 3.76-59.277 19.166-79.165 41.767h-90.335v30h70.723c-4.943 10.617-8.448 22.033-10.251 34h-60.472v30h59.577c1.06 11.883 3.781 23.295 7.935 34h-67.512v30h84.2c12.507 16.631 29.048 30.062 48.156 38.831v27.169h-173.856zm321.431 159.431c0 52.621-42.81 95.431-95.431 95.431s-95.432-42.81-95.432-95.431 42.811-95.432 95.432-95.432 95.431 42.811 95.431 95.432zm-73.288 170.569h-44.286v-47.095c7.19 1.286 14.589 1.957 22.143 1.957s14.953-.672 22.143-1.957z"/><path d="m217.666 217.098c0-21.137 17.196-38.333 38.334-38.333v-30c-37.679 0-68.334 30.654-68.334 68.333z"/></g></svg>';
  const SVGBad='<script>alert("XSS")</script>';

  let entityToAddOKWithSource: any;


  beforeAll(async () => {
    ({ app, server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin } = await setupTestApp());
    ideaTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    sourceTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    authorTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
    keywordTestHelper.setParams(server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('анонимное чтение списка идей', async () => {
    await ideaTestHelper.getAnonymous(10, [
      { name: 'id', type: 'number' }, 
      { name: 'name', type: 'string' }, 
      { name: 'source', type: 'object' }
    ]);
  });

  it('попытка создать идею без авторизации должна вернуть 401', async () => {
    await ideaTestHelper.createAnonymous(entityToAddOK);
  });

  it('подготовка данных для тестов - удаление старых данных и добавление нового автора / источника', async () => {
    await ideaTestHelper.removeOldData(entityToAddOK);
    await sourceTestHelper.removeOldData(sourceToAddOK);
    await authorTestHelper.removeOldData(authorToAddOK);
    await keywordTestHelper.removeOldData({
      name: keywordToAddOK.names[0], 
      class_keyword_id: keywordToAddOK.class_keyword_id
    });
    authorID = await authorTestHelper.createEntityAndCheck(authorToAddOK);
    sourceID = await sourceTestHelper.createEntityAndCheck({ ...sourceToAddOK, author: {id: authorID } });
    keyword  = await keywordTestHelper.createKeywordAndCheck(keywordToAddOK);
    entityToAddOKWithSource = { ...entityToAddOK, source: {id: sourceID }, keyword_names: [{id: keyword.names[0].id }] };
    
  });

  it('попытка создания невалидной идеи пользователем должна вернуть 400', async () => {
    const res = await ideaTestHelper.simpleCreate(tokenUser, entityToAddBad, StatusCode.BadRequest);
  });

  it('попытка создать идею с просроченным и плохим токеном должна вернуть 401', async () => {
    await ideaTestHelper.createWithBadTokens(entityToAddOKWithSource);
  });

  it('создание идеи пользователем', async () => {
    //console.log('entityToAddOKWithSource', entityToAddOKWithSource);
    entityID = await ideaTestHelper.createEntityAndCheck(entityToAddOKWithSource);
  });

  it('попытка модификация идеи другим пользователем должна вернуть 401', async () => {
    await ideaTestHelper.updateByAnotherUser(entityID);
  }); 

  it('попытка модификации идеи невалидными данными должна вернуть 400', async () => {
    await ideaTestHelper.updateByBadData( entityID, { name: '1' });
  });

  it('попытка модификации идеи невалидными данными - плохой SVG должна вернуть 400', async () => {
    await ideaTestHelper.updateByBadData( entityID, { SVG: SVGBad });
  });

  it('модификация идеи пользователем - добавление SVG', async () => {
    await ideaTestHelper.updateEntity( entityID, { SVG });
  });

  it('добавление идеи с ошибочным SVG пользователем', async () => {
    await ideaTestHelper.simpleRemove(tokenSuperAdmin, entityID);
    const res = await ideaTestHelper.simpleCreate(tokenUser, { ...entityToAddOKWithSource, SVG: SVGBad }, StatusCode.BadRequest);
  });

  it('добавление идеи с корректным SVG пользователем', async () => {
    entityID = await ideaTestHelper.createEntityAndCheck({ ...entityToAddOKWithSource, SVG });
  });

  it('попытка создать идею-копию пользователем должна вернуть 500', async () => {
      const resCopy = await ideaTestHelper.simpleCreate(tokenUser, entityToAddOKWithSource, StatusCode.InternalServerError);
  });

  it('публикация идеи пользователем', async () => {
    // посылаем запрос на "к модерации" (пользователь)
    const resModerate = await ideaTestHelper.simpleToModerate(tokenUser, entityID);
    const resAuthor = await authorTestHelper.simpleFind(tokenSuperAdmin, {id: authorID});
    expect(resAuthor.body[0].verification_status).toBe(VerificationStatus.ToModerate);
    const resKeyword = await keywordTestHelper.simpleFind(tokenSuperAdmin, {id: keyword.names[0].keyword_id});
    expect(resKeyword.body[0].verification_status).toBe(VerificationStatus.ToModerate);
    const resSource = await sourceTestHelper.simpleFind(tokenSuperAdmin, {id: sourceID});
    expect(resSource.body[0].verification_status).toBe(VerificationStatus.ToModerate);
  });

  it('попытка удалить идею пользователем после публикации должна вернуть 401', async () => {
      const delRes=await ideaTestHelper.simpleRemove(tokenUser, entityID, StatusCode.Unauthorized);
  });

  it('попытка публикации пользователем идеи после публикации вернуть ошибку 400', async () => {
      const resModerate2 = await ideaTestHelper.simpleToModerate(tokenUser, entityID, StatusCode.BadRequest);
  });

  it('модерация идеи администратором', async () => {
      await ideaTestHelper.simpleModerate(tokenAdmin, entityID, 'approve', '', StatusCode.BadRequest); // ошибка т.к. автор непроверен
      await authorTestHelper.simpleModerate(tokenAdmin, authorID, 'approve');
      await ideaTestHelper.simpleModerate(tokenAdmin, entityID, 'approve', '', StatusCode.BadRequest); // ошибка т.к. ключевое слово непроверен
      await keywordTestHelper.simpleModerate(tokenAdmin, keyword.names[0].keyword_id, 'approve');
      await ideaTestHelper.simpleModerate(tokenAdmin, entityID, 'approve', '', StatusCode.BadRequest); // ошибка т.к. источник непроверен
      await sourceTestHelper.simpleModerate(tokenAdmin, sourceID, 'approve');
      await ideaTestHelper.moderateApprove( entityID, 'approve');
  }); 

  it('попытка удалить идею администратором после модерации должна вернуть 401', async () => {
      const delRes=await ideaTestHelper.simpleRemove(tokenAdmin, entityID, StatusCode.Unauthorized);
  });

  it('удаление идеи суперадмином', async () => {
      const delRes=await ideaTestHelper.simpleRemove(tokenSuperAdmin, entityID);
  });

  it('отклонение идеи администратором', async () => {
    entityID = await ideaTestHelper.moderateReject(entityToAddOKWithSource);
  });

  it('проверка невозможности удаления связанных с идеей источника, ключевого слова и автора', async () => {
    const delRes=await sourceTestHelper.simpleRemove( tokenSuperAdmin, sourceID, StatusCode.BadRequest);
    const delRes2=await authorTestHelper.simpleRemove( tokenSuperAdmin, authorID, StatusCode.BadRequest);
    const delRes3=await keywordTestHelper.simpleRemove( tokenSuperAdmin, keyword.names[0].keyword_id, StatusCode.BadRequest);
  });

  it('удаление идеи, источника, ключевого слова и автора суперадмином', async () => {
      const delRes1=await ideaTestHelper.simpleRemove( tokenSuperAdmin, entityID);
      const delRes=await sourceTestHelper.simpleRemove( tokenSuperAdmin, sourceID);
      const delRes2=await authorTestHelper.simpleRemove( tokenSuperAdmin, authorID);
      const delRes3=await keywordTestHelper.simpleRemove( tokenSuperAdmin, keyword.names[0].keyword_id);
  }); 

}); 
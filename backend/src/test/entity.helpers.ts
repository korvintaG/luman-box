import { NestExpressApplication } from '@nestjs/platform-express';
import { StatusCode } from 'src/types/custom';
import request from 'supertest';
import { setupTestApp } from './tests.helpers';
import { keywordTestHelper } from 'src/DDD/keywords/tests/keyword.helper';
import { checkPhoto, uploadPhoto } from 'src/files/tests/files.helpers';
import { authorTestHelper } from 'src/DDD/authors/tests/author.helper';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';

export class EntityTestHelper {
  private readonly apiURL: string;
  private server: any;
  private tokenUser: string;
  private tokenUser2: string;
  private tokenAdmin: string;
  private tokenSuperAdmin: string;

  constructor(apiURL: string) {
    this.apiURL = apiURL;
  }

  setParams(server: any, tokenUser: string, tokenUser2: string, tokenAdmin: string, tokenSuperAdmin: string) {
    this.server = server;
    this.tokenUser = tokenUser;
    this.tokenUser2 = tokenUser2;
    this.tokenAdmin = tokenAdmin;
    this.tokenSuperAdmin = tokenSuperAdmin;
  }

  async simpleGet(
    token: string | null,
    expectedStatus: number = StatusCode.successGet,
  ) {
    if (token) {
    return request(this.server)
      .get(this.apiURL)
        .set('Authorization', `Bearer ${token}`)
        .expect(expectedStatus);
    } else {
      return request(this.server)
        .get(this.apiURL)
        .expect(expectedStatus);
    }
  }

  async simpleAttitude(
    token: string,
    idea_id: number | null,
    dto: any,
    expectedStatus: number = StatusCode.successCreate,
  ) {
    let URL='';
    if (idea_id === null) {
      URL = this.apiURL;
    } else {
      URL = `${this.apiURL}/${idea_id}`;
    }
    if (token && token !== '') {
      return request(this.server)
        .post(URL)
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect((res) => { if (res.status !== expectedStatus) { console.log('simpleAttitude  URL: ', URL, ' dto: ', dto, ' res.body: ', res.body); } })
        .expect(expectedStatus);
    } else {
      return request(this.server)
        .post(URL)
        .send(dto)
        .expect((res) => { if (res.status !== expectedStatus) { console.log('simpleAttitude URL: ', URL, ' dto: ', dto, ' res.body: ', res.body); } })
        .expect(expectedStatus);
    }

  }


  
  async simpleCreate(
    token: string,
    dto: any,
    expectedStatus: number = StatusCode.successCreate,
  ) {
    if (token) {  
    return request(this.server)
      .post(this.apiURL)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect((res) => { if (res.status !== expectedStatus) { console.log('simpleCreate dto: ', dto, ' res.body: ', res.body); } })
      .expect(expectedStatus)
    } else {
      return request(this.server)
        .post(this.apiURL)
        .send(dto)
        .expect((res) => { if (res.status !== expectedStatus) { console.log('simpleCreate dto: ', dto, ' res.body: ', res.body); } })
        .expect(expectedStatus)
    }
  }

  async simpleUpdate(
    token: string,
    id: number,
    dto: any,
    expectedStatus: number = StatusCode.successUpdate,
  ) {
    return request(this.server)
      .patch(`${this.apiURL}/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(expectedStatus);
  }

  async simpleRemove(
    token: string,
    id: number,
    expectedStatus: number = StatusCode.successDelete,
  ) {
    const URL = `${this.apiURL}/${id}`;
    return request(this.server)
      .delete(URL)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect((res) => { if (res.status !== expectedStatus) { console.log('simpleRemove URL: ', URL, 'res.body', res.body); } })
      .expect(expectedStatus);
  }

  async simpleToModerate(
    token: string,
    id: number,
    expectedStatus: number = StatusCode.successToModerate,
  ) {
    const URL = `${this.apiURL}/to-moderate/${id}`;
    return request(this.server)
      .post(URL)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect((res) => { if (res.status !== expectedStatus) { console.log('simpleToModerate URL: ', URL, 'res.body', res.body); } })
      .expect(expectedStatus);
  }

  async simpleModerate(
    token: string,
    id: number,
    action: 'approve' | 'reject',
    note: string = '',
    expectedStatus: number = StatusCode.successModerate,
  ) {
    let noteReq = '';
    if (note && note !== '') {
      noteReq = `&notes=${encodeURIComponent(note)}`;
    }
    const url = `${this.apiURL}/moderate/${id}?action=${action}${noteReq}`;
    //console.log('simpleModerate url: ', url);
    return request(this.server)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(expectedStatus);
  }

  async simpleFind(
    token: string,
    dto: any,
    expectedStatus: number = StatusCode.successFind,
  ) {
    const URL = `${this.apiURL}/find`;
    return request(this.server)
      .get(URL)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect((res) => { if (res.status !== expectedStatus) { console.log('simpleFind URL: ', URL, 'dto', dto, 'res.body', res.body); } })
      .expect(expectedStatus);
  }

  async simpleAttitudeFind(
    token: string,
    idea_id: number,
    expectedStatus: number = StatusCode.successFind,
  ) {
    const URL = `${this.apiURL}/${idea_id}`;
    return request(this.server)
      .get(URL)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect((res) => { if (res.status !== expectedStatus) { console.log('simpleAttitudeFind ideaID: ', idea_id, ' URL: ', URL, ' res.body', res.body); } })
      .expect(expectedStatus);
  }


  async getAnonymous(minCount: number, 
    fieldsTypes: { name: string, type: string }[]) {
      const res = await this.simpleGet(null);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(minCount);
  
      const first = res.body[0];
      for (const field of fieldsTypes) {
        expect(first).toHaveProperty(field.name);
        expect(typeof first[field.name]).toBe(field.type);
      }
      return res.body;
  }

  async createAnonymous(dto: any ) {
    const res = await this.simpleCreate(null, dto, StatusCode.Unauthorized);
    expect(res.body.error).toBe('Unauthorized');
  }


  async removeOldData( findDto: any) {
    const res = await this.simpleFind(this.tokenSuperAdmin, findDto);
    for (const item of res.body) {
      await this.simpleRemove(this.tokenSuperAdmin, item.id);
    }
  }

  async createEntityAndCheck( dto: any) {
    const res = await this.simpleCreate(this.tokenUser, dto);
    Object.keys(dto).forEach((key) => {
      expect(res.body).toHaveProperty(key);
      if (key === 'SVG') {
        expect(res.body[key]).toBeDefined();
      }
      else {
        const expectedValue = dto[key];
        const actualValue = res.body[key];

        if (Array.isArray(expectedValue)) {
          expect(Array.isArray(actualValue)).toBe(true);
          if (
            expectedValue.length > 0 &&
            typeof expectedValue[0] === 'object' &&
            expectedValue[0] !== null &&
            'id' in expectedValue[0]
          ) {
            expectedValue.forEach((expectedItem: any) => {
              const containsId = Array.isArray(actualValue) && actualValue.some((actualItem: any) =>
                actualItem && typeof actualItem === 'object' && 'id' in actualItem && actualItem.id === expectedItem.id
              );
              expect(containsId).toBe(true);
            });
          } else {
            expect(actualValue).toEqual(expectedValue);
          }
        } else {
          expect(actualValue).toEqual(expectedValue);
        }
      }
    });
    return res.body.id;
  }

  async createWithBadTokens(dto: any) {
    const res = await this.simpleCreate(process.env.OLD_TOKEN as string, dto, StatusCode.Unauthorized);
    expect(res.body.error).toBe('Unauthorized');

    const res2 = await this.simpleCreate(process.env.ERROR_TOKEN as string, dto, StatusCode.Unauthorized);
    expect(res2.body.error).toBe('Unauthorized');
  }

  async attitudeWithBadTokens(idea_id: number, dto: any) {
    const res = await this.simpleAttitude(process.env.OLD_TOKEN as string, idea_id, dto, StatusCode.Unauthorized);
    expect(res.body.error).toBe('Unauthorized');

    const res2 = await this.simpleAttitude(process.env.ERROR_TOKEN as string, idea_id, dto, StatusCode.Unauthorized);
    expect(res2.body.error).toBe('Unauthorized');
  }

  async updateByAnotherUser(id: number) {
    const res = await this.simpleUpdate(this.tokenUser2, id, {}, StatusCode.Unauthorized);
    expect(res.body.error).toBe('Unauthorized');
  }


  async updateByBadData( id: number, dto: any) {
    const res=await this.simpleUpdate(this.tokenUser, id, dto, StatusCode.BadRequest);
    expect(res.body.error).toBe('Bad Request');
  }

  async updateEntity(id: number, dto: any) {
    const res=await this.simpleUpdate(this.tokenUser, id, dto);
    Object.keys(dto).forEach((key) => {
      expect(res.body).toHaveProperty(key);
      expect(res.body[key]).toEqual(dto[key]);
    });
  }

  async uploadPhotoAndSet( id: number, photo: string) {
    const res=await uploadPhoto(this.server, this.tokenUser, photo);
    expect(res.body.file_name).toBeDefined();
    const res2=await this.simpleUpdate(this.tokenUser, id, { image_URL: res.body.file_name });
    expect(res2.body.image_URL).toBeDefined();
    const authorImage = res2.body.image_URL;
    await checkPhoto(this.server, authorImage);
    return authorImage;
  }

  async createEntityWithPhoto(dto: any, photo: string): Promise<{ entityID: number, image_URL: string }> {
    const res=await uploadPhoto(this.server, this.tokenUser, photo);
    expect(res.body.file_name).toBeDefined();
    const res2=await this.simpleCreate(this.tokenUser, {...dto, image_URL: res.body.file_name });
    const entityID = res2.body.id;
    expect(res2.body.image_URL).toBeDefined();
    const image_URL = res2.body.image_URL;
    await checkPhoto(this.server, image_URL);
    return { entityID, image_URL };
  }

  async moderateApprove(id: number, action: 'approve' | 'reject', note: string = '') {  
    const resModerateAdmin = await this.simpleModerate(this.tokenAdmin, id, action, note);
    // проверяем, что модерация прошла успешно
    const findRes2 = await this.simpleFind(this.tokenSuperAdmin, {id});
    expect(findRes2.body.length).toBe(1);
    expect(findRes2.body[0].verification_status).toBe(VerificationStatus.Moderated);
  }

  async moderateReject(dto: any ) {  
    // создаем автора повторно еще раз (пользователь)
    const note = 'test note';
    const resCopy3 = await this.simpleCreate(this.tokenUser, dto);
    const entityID = resCopy3.body.id;
    // посылаем запрос на "к модерации" (пользователь)
    const resModerate3 = await this.simpleToModerate(this.tokenUser, entityID);
    // модерируем автора (админ)
    const resModerateAdmin2 = await this.simpleModerate(this.tokenAdmin, entityID, 'reject', note);
    // проверяем, что запрет прошёл успешно
    const findRes3 = await this.simpleFind(this.tokenSuperAdmin, dto);
    expect(findRes3.body.length).toBe(1);
    expect(findRes3.body[0].verification_status).toBe(VerificationStatus.Rejected);
    expect(findRes3.body[0].moderation_notes).toBe(note);
    return entityID;
  }
}


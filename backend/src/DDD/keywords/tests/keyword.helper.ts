import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import { EntityTestHelper } from 'src/test/entity.helpers';
import { StatusCode } from 'src/types/custom';
import request from 'supertest';

export const apiKeywords = '/api/keywords';
export class KeywordTestHelper extends EntityTestHelper {

  async getAnonymous(minCount: number) {
      const res = await this.simpleGet(null);
      expect(typeof res.body === 'object' && res.body !== null).toBe(true);
      expect(Array.isArray(res.body.keywords)).toBe(true);
      expect(res.body.keywords.every((el: any) => el.id !== undefined)).toBe(true);
      expect(res.body.keywords.every((el: any) => el.name !== undefined)).toBe(true);
      expect(res.body.keywords.length).toBeGreaterThanOrEqual(minCount);
      expect(res.body.current).toBeDefined();
      expect(res.body.current.id).toBeDefined();

      return res.body;
  }

  async createKeywordAndCheck( dto: any) {
    const res = await this.simpleCreate(this.tokenUser, dto);
    expect(res.body.id).toBeDefined();
    expect(res.body.class_keyword_id).toBe(dto.class_keyword_id);
    expect(res.body.names.length).toBe(dto.names.length);
    // TODO проверить, что каждый res.body.names[i].name включается в dto.names
    for (let i = 0; i < dto.names.length; i++) {
      expect(dto.names.includes(res.body.names[i].name)).toBe(true);
    }
    expect(res.body.name).toBe(dto.names[dto.default_name_index]);
    return res.body;
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
    const findRes3 = await this.simpleFind(this.tokenSuperAdmin, {id: entityID});
    expect(findRes3.body.length).toBe(1);
    expect(findRes3.body[0].verification_status).toBe(VerificationStatus.Rejected);
    expect(findRes3.body[0].moderation_notes).toBe(note);
    return entityID;
  }

  
}
export const keywordTestHelper = new KeywordTestHelper(apiKeywords);



/*export const createEntity = async (
    server: any,
    token: string,
    dto: any,
    expectedStatus = StatusCode.successCreate
  ) => {
    return request(server)
      .post(apiKeywords)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(expectedStatus);
  };
  
  export const updateEntity = async (
    server: any,
    token: string,
    id: number,
    dto: any,
    expectedStatus = StatusCode.successUpdate
  ) => {
    return request(server)
      .patch(`${apiKeywords}/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(expectedStatus);
  };
  
  
  export const deleteEntity = async (
    server: any,
    token: string,
    id: number,
    expectedStatus = StatusCode.successDelete
  ) => {
    return request(server)
      .delete(`${apiKeywords}/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(expectedStatus);
  };
  
  export const toModerateEntity = async (
    server: any,
    token: string,
    id: number,
    expectedStatus = StatusCode.successToModerate
  ) => {
    return request(server)
      .post(`${apiKeywords}/to-moderate/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(expectedStatus);
  };
  
  export const moderateEntity = async (
    server: any,
    token: string,
    id: number,
    action: 'approve' | 'reject',
    note: string = '',
    expectedStatus = StatusCode.successModerate
  ) => {
    let noteReq = '';
    if (note) {
      noteReq = `&notes=${encodeURIComponent(note)}`;
    }
    return request(server)
      .post(`${apiKeywords}/moderate/${id}?action=${action}${noteReq}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(expectedStatus);
  };
  
  export const findEntity = async (
    server: any,
    token: string,
    dto: any,
    expectedStatus = StatusCode.successFind
  ) => {
    return request(server)
      .get(`${apiKeywords}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(expectedStatus);
  };
  
  */
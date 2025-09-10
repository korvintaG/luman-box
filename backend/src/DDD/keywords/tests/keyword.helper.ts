import { EntityTestHelper } from 'src/test/entity.helpers';
import { StatusCode } from 'src/types/custom';
import request from 'supertest';

export const apiKeywords = '/api/keywords';
export const keywordTestHelper = new EntityTestHelper(apiKeywords);

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
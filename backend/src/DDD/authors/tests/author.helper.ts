import request from 'supertest';

const apiAuthors = '/api/authors';

export const createAuthor = async (
    server: any,
    token: string,
    dto: any,
    expectedStatus = 201
  ) => {
    return request(server)
      .post(apiAuthors)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(expectedStatus);
  };
  
  export const updateAuthor = async (
    server: any,
    token: string,
    id: number,
    dto: any,
    expectedStatus = 200
  ) => {
    return request(server)
      .patch(`${apiAuthors}/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(expectedStatus);
  };
  
  
  export const deleteAuthor = async (
    server: any,
    token: string,
    id: number,
    expectedStatus = 200
  ) => {
    return request(server)
      .delete(`${apiAuthors}/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(expectedStatus);
  };
  
  export const toModerateAuthor = async (
    server: any,
    token: string,
    id: number,
    expectedStatus = 201
  ) => {
    return request(server)
      .post(`${apiAuthors}/to-moderate/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(expectedStatus);
  };
  
  export const moderateAuthor = async (
    server: any,
    token: string,
    id: number,
    action: 'approve' | 'reject',
    note: string = '',
    expectedStatus = 201
  ) => {
    let noteReq = '';
    if (note) {
      noteReq = `&notes=${encodeURIComponent(note)}`;
    }
    return request(server)
      .post(`${apiAuthors}/moderate/${id}?action=${action}${noteReq}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(expectedStatus);
  };
  
  export const findAuthors = async (
    server: any,
    token: string,
    dto: any,
    expectedStatus = 200
  ) => {
    return request(server)
      .get(`${apiAuthors}/find`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(expectedStatus);
  };
  
  
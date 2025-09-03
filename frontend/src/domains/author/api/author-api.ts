import {  AuthorAdd,  AuthorDetail,  AuthorDetailPartial, AuthorList, AuthorPlain, AuthorShort}  from '../types/author-type'
import { EntityAPI, IEntityAPI } from '../../../shared/api/entity-api';

export interface IAuthorAPI extends IEntityAPI<AuthorAdd, AuthorPlain, 
  AuthorDetailPartial, AuthorDetail,
  undefined, AuthorList[]> {
}

export class AuthorAPI extends EntityAPI<
  AuthorAdd, AuthorPlain, 
  AuthorDetailPartial, AuthorDetail,
  undefined, AuthorList[]>
implements IAuthorAPI {
  constructor() {
    super("authors");
  }
}

const authorAPI=new AuthorAPI();
export default authorAPI;

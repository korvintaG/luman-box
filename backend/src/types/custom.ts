export interface SimpleEntity {
  id: number;
  name: string;
}

export interface SimpleEntityWithCnt extends SimpleEntity {
  cnt: number;
}

export interface SimpleEntityWithOutID extends SimpleEntity {
  id_out: string;
}

export interface IAuthor extends SimpleEntityWithOutID {}

export interface ISource extends SimpleEntityWithOutID {
  author_id: number;
}

export interface IKeyword extends SimpleEntityWithOutID {}

export interface IIdea extends SimpleEntityWithOutID {
  source_id: number;
  original_text: string;
  content: string;
  date_time_create: string;
  keywords: number[];
}

export interface IIdeaBySourceAndKeyword {
  source_id: number;
  keyword_id: number;
}

export interface IModerate {
  action: 'approve' | 'reject';
}

export type AccessToken = {
  access_token: string;
};

export type AccessTokenPayload = {
  id: number;
  name: string;
};

export const enum Role {
  User = 0,
  Admin = 1,
  //Blocked = 2,
  SuperAdmin = 3,
}

export interface IUser extends SimpleEntity {
  role_id: Role;
}

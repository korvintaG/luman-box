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

export interface IInterconnectionWay {
  is_reverse: number;
}


export interface IdeaForList {
  id: number,
  name: string,
  source_id: number,
  source_name: string
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

export type InterconnestionsCount = {
  id: number;
  name: string;
  cnt1: number;
  cnt2: number;
}

export enum InterconnestionsTypes {
  Details = 3,
  SolvesProblem = 5 
}

export enum InterconnestionsReverseTypes { // временно не нужен
  Generalizes = 3,
  IsProblemSolution = 5
}


// Фильтрация числовых ключей
export const InterconnestionsTypesArray = Object.values(InterconnestionsTypes)
  .filter(value => typeof value === 'number') as InterconnestionsTypes[];
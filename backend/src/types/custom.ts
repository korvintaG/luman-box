export interface SimpleEntity {
  id: number;
  name: string;
}

export interface SimpleEntityWithOutID extends SimpleEntity {
  id_out: string;
}

export interface IAuthor extends SimpleEntityWithOutID {
}
  
export interface ISource extends SimpleEntityWithOutID {
    author_id: number;
 }
  
export interface IKeyword extends SimpleEntityWithOutID {
}

export interface IIdea extends SimpleEntityWithOutID  {
  source_id: number;
  original_text: string;
  content: string;
  date_time_create: string;
  keywords: number[];
}

export type AccessToken = {
  access_token: string;
};

export type AccessTokenPayload = {
  id: number;
  name: string;
};

export interface IUser extends SimpleEntity{};
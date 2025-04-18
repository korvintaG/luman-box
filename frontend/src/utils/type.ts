// универсальные типы
export type IDObject = {
  id: number;
};

export type NameObject = {
  name: string;
};

export type SimpleNameObject = IDObject & NameObject;

export type SimpleNameObjectWithCnt = IDObject & NameObject & { cnt: number };

// Авторы
export type AuthorInner = NameObject;
export type AuthorRaw = AuthorInner & {
  user?: UserPartial;
  moderator?: UserPartial;
  sources?: SimpleNameObject[];
  ideas?: SimpleNameObject[];  
  keywords?: SimpleNameObject[];  
};
export type AuthorRawPartial = Partial<AuthorRaw>;
export type AuthorPartial = Partial<Author> & IDObject; // то же что автор, но обязательный ID
export type Author = AuthorRaw &
  IDObject & {
    moderated?: number;
  };

// Источники
export type SourceInner = NameObject;
export type SourceRaw = SourceInner & {
  author?: AuthorPartial;
  user?: UserPartial;
  moderator?: UserPartial;
  ideas?: SimpleNameObject[];
  keywords?: SimpleNameObjectWithCnt[];
};
export type SourceRawPartial = Partial<SourceRaw>;
export type SourcePartial = Partial<Source> & IDObject;
export type Source = SourceRaw &
  IDObject & {
    moderated?: number;
  };

export function sourceFullNameFromObj(
  source: SourcePartial | Source | null | undefined,
): string {
  let name = "";
  if (source) {
    if (source.name) {
      name = source.name;
      if (source.author)
        if (source.author.name) name = name + " // " + source.author.name;
    }
  }
  return name;
}

export function authorNameFromObj(author?: Partial<Author>): string {
  if (author) if (author.name) return author.name;
  return "";
}

// ключевые слова
export type KeywordInner = NameObject;
export type KeywordRaw = KeywordInner & {
  user?: UserPartial;
  moderator?: UserPartial;
  sources?: SimpleNameObject[];
  authors?: SimpleNameObject[];
  ideas?: SimpleNameObject[];
};
export type KeywordRawPartial = Partial<KeywordRaw>;
export type Keyword = KeywordRaw &
  IDObject & {
    moderated?: number;
  };
export type KeywordPartial = Partial<Keyword> & IDObject;

// Идеи
export type IdeaInner = NameObject & {
  original_text: string;
  content: string;
  date_time_create: string;
};

export type IdeaRaw = IdeaInner & {
  source: SourcePartial;
  user?: UserPartial;
  moderator?: UserPartial;
  keywords: KeywordPartial[];
  attitudes?:IdeaAttitudes;
};

export type IdeaRawPartial = Partial<IdeaRaw>;
export type IdeaPartial = Partial<Idea> & IDObject;

export type UserAttitude={
  like: number;
  importance: number;
  truth: number;  
}

export type UserAttitudeIdea = Partial<UserAttitude> & IDObject;

export type IdeaAttitudes={
  all:{
    like:number[];
    importance:number[];
    truth:number[];
  }
  user?:UserAttitude;
}

export type Idea = IdeaRaw &
  IDObject & {
    moderated?: number;
  };

/*export type KeywordsIdea = {
    keyword_id: number,
    idea_id: number
}*/

export type HTMLEditElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export const enum RequestStatus {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Failed = "failed",
  FailedUpdate = "failedUpdate",
  FailedAdd = "failedAdd",
  FailedDelete = "failedDelete",
  FailedUnAuth = "failedUnAuth",
  Updated = "updated",
  Added = "added",
  Deleted = "deleted",
  Attituding = "attituding",
  Attituded = "attituded"
}

export function isRequestFailed(request: RequestStatus): boolean {
  return request.toString().startsWith("failed");
}

export function isDMLRequestFailed(request: RequestStatus): boolean {
  return (
    request === RequestStatus.FailedAdd ||
    request === RequestStatus.FailedUpdate ||
    request === RequestStatus.FailedDelete
  );
}

export function isDMLRequestOK(request: RequestStatus): boolean {
  return (
    request === RequestStatus.Added ||
    request === RequestStatus.Updated ||
    request === RequestStatus.Deleted
  );
}

export type RequestStatusKey = keyof typeof RequestStatus;
export type RequestStatusValue = (typeof RequestStatus)[RequestStatusKey];

export type UserInner = NameObject & { password: string };
/*export type UserRaw = UserInner;
export type UserRawPartial = Partial<UserRaw>;
export type Author = AuthorInner & IDObject;
export type AuthorPartial = Partial<Author> & IDObject // то же что автор, но обязательный ID
*/

export const enum Role {
  User = 0,
  Admin = 1,
  //Blocked = 2,
  SuperAdmin = 3,
}

export type User = {
  name: string;
  id: number;
  role_id: Role;
};

export type UserPartial = Partial<User>;

export type LoginData = {
  name: string;
  password: string;
};

export type Success = {
  success: boolean;
};

export type ServerResponse<T> = Success & T;

export type LoginResult = {
  access_token: string;
  user: User;
};

export type UserResponseToken = ServerResponse<{
  user: User;
  access_token: string;
  refreshToken: string;
}>;

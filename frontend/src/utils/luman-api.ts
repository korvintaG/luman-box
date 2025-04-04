import {
  Author,
  AuthorPartial,
  AuthorRawPartial,
  Source,
  Idea,
  IdeaPartial,
  IdeaRawPartial,
  ServerResponse,
  LoginData,
  LoginResult,
  User,
  Keyword,
  KeywordRawPartial,
  SourceRawPartial,
  SourcePartial,
  KeywordPartial,
  Success,
  UserAttitude,
  UserAttitudeIdea,
} from "./type";
import { Api } from "./api";
import { getCookie } from "./cookie";
import { omit } from "lodash";

export const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";

export interface ILumanAPI {
  // авторы
  getAuthors: () => Promise<Author[]>;
  getAuthor: (id: number) => Promise<Author>;
  setAuthor: (data: AuthorPartial) => any;
  addAuthor: (data: AuthorRawPartial) => any;
  delAuthor: (id: number) => any;
  approveAuthor: (id: number) => any;
  rejectAuthor: (id: number) => any;
  // источники
  getSources: () => Promise<Source[]>;
  getSource: (id: number) => Promise<Source>;
  setSource: (data: SourcePartial) => any;
  addSource: (data: SourceRawPartial) => any;
  delSource: (id: number) => any;
  approveSource: (id: number) => any;
  // ключевые слова
  getKeywords: () => Promise<Keyword[]>;
  getKeyword: (id: number) => Promise<Keyword>;
  setKeyword: (data: KeywordPartial) => any;
  addKeyword: (data: KeywordRawPartial) => any;
  delKeyword: (id: number) => any;
  approveKeyword: (id: number) => any;
  // идеи
  getIdeas: () => Promise<Idea[]>;
  getIdea: (id: number) => Promise<Idea>;
  setIdea: (data: IdeaPartial) => any;
  addIdea: (data: IdeaRawPartial) => any;
  delIdea: (id: number) => any;
  approveIdea: (id: number) => any;
  // авторизация
  login: (data: LoginData) => Promise<ServerResponse<LoginResult>>;
  getUser: () => Promise<User>;
  logout: () => Promise<Success>;
}

export class LumanAPI extends Api implements ILumanAPI {

  // **********************************************
  // * Авторизация
  // **********************************************
  login = (data: LoginData): Promise<ServerResponse<LoginResult>> => {
    return this.request(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  };

  getUser = (): Promise<User> => {
    return this.requestWithRefresh<User>("/auth/user", {
      method: "GET",
      headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
    });
  };

  logout = (): Promise<Success> => {
    return this.request<Success>("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  };

  // **********************************************
  // * Авторы
  // **********************************************

  getAuthors = (): Promise<Author[]> => {
    return this.request<Author[]>(`/authors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  getAuthor = (id: number): Promise<Author> => {
    return this.request<Author>(`/authors/${id}`, { method: "GET" });
  };

  addAuthor = (data: AuthorRawPartial) => {
    return this.requestWithRefresh("/authors/", {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  setAuthor = (data: AuthorPartial) => {
    console.log("setAuthor", data);
    return this.requestWithRefresh(`/authors/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  approveAuthor = (id: number) => {
    return this.requestWithRefresh(`/authors/moderate/${id}?action=approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  rejectAuthor = (id: number) => {
    return this.requestWithRefresh(`/authors/moderate/${id}?action=reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  delAuthor = (id: number) => {
    return this.requestWithRefresh(`/authors/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
    });
  };

  // **********************************************
  // * Источники
  // **********************************************

  getSources = (): Promise<Source[]> => {
    return this.request<Source[]>(`/sources`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  getSource = (id: number): Promise<Source> => {
    return this.request<Source>(`/sources/${id}`, { method: "GET" });
  };

  addSource = (data: SourceRawPartial) => {
    return this.requestWithRefresh("/sources/", {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  setSource = (data: SourcePartial) => {
    return this.requestWithRefresh(`/sources/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  approveSource = (id: number) => {
    return this.requestWithRefresh(`/sources/moderate/${id}?action=approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  rejectSource = (id: number) => {
    return this.requestWithRefresh(`/sources/moderate/${id}?action=reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  delSource = (id: number) => {
    return this.requestWithRefresh(`/sources/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
    });
  };

  // **********************************************
  // * Идеи
  // **********************************************

  getIdeas = (): Promise<Idea[]> => {
    return this.request<Idea[]>(`/ideas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  getIdeasBySrcKw = (cond: {
    source_id: number;
    keyword_id: number;
  }): Promise<Idea[]> => {
    return this.request<Idea[]>(
      `/ideas?source_id=` + cond.source_id + "&keyword_id=" + cond.keyword_id,
      { method: "GET" },
    );
  };

  getIdea = (id: number): Promise<Idea> => {
    return this.request<Idea>(`/ideas/${id}`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
});
  };

  addIdea = (data: IdeaRawPartial) => {
    return this.requestWithRefresh("/ideas/", {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  setIdea = (data: IdeaPartial) => {
    return this.requestWithRefresh(`/ideas/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  approveIdea = (id: number) => {
    return this.requestWithRefresh(`/ideas/moderate/${id}?action=approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  rejectIdea = (id: number) => {
    return this.requestWithRefresh(`/ideas/moderate/${id}?action=reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  delIdea = (id: number) => {
    return this.requestWithRefresh(`/ideas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
    });
  };

  getIdeaBySourceKeyword = (findCond: {
    source_id: number;
    keyword_id: number;
  }): Promise<Idea> => {
    return this.request<Idea>(
      `/ideas/find-by-source-kw/${findCond.source_id}/${findCond.keyword_id}`,
      { method: "GET" },
    );
  };

  attitudeIdea = (userAttitudeIdea: UserAttitudeIdea) =>{
    const bod=omit(userAttitudeIdea,'id');
    console.log('attitudeIdea',userAttitudeIdea,bod)
    return this.requestWithRefresh(`/attitudes/${userAttitudeIdea.id}`, {
      method: "POST",
      body: JSON.stringify({ ...omit(userAttitudeIdea,'id')}),      
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}` 
      },
    });

  }

  // **********************************************
  // * Ключевые слова
  // **********************************************

  getKeywords = (): Promise<Keyword[]> => {
    return this.request<Keyword[]>(`/keywords`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  getKeyword = (id: number): Promise<Keyword> => {
    return this.request<Keyword>(`/keywords/${id}`, { method: "GET" });
  };

  addKeyword = (data: KeywordRawPartial) => {
    return this.requestWithRefresh("/keywords/", {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  setKeyword = (data: KeywordPartial) => {
    return this.requestWithRefresh(`/keywords/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  approveKeyword = (id: number) => {
    return this.requestWithRefresh(`/keywords/moderate/${id}?action=approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  rejectKeyword = (id: number) => {
    return this.requestWithRefresh(`/keywords/moderate/${id}?action=reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  delKeyword = (id: number) => {
    return this.requestWithRefresh(`/keywords/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
    });
  };
}

const lumanAPI=new LumanAPI(API_URL);
export default lumanAPI;

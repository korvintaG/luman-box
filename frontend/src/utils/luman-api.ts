import {
  Author, AuthorPartial, AuthorRawPartial, Source, Idea, IdeaRaw, IdeaPartial, IdeaRawPartial,
  SourceRaw, ServerResponse, LoginData, LoginResult, User,
  Keyword, KeywordRawPartial, SourceRawPartial, SourcePartial, KeywordPartial, Success
} from "./type";
import { Api } from './api'
import { getCookie, setCookie } from './cookie';

const URL_API = 'http://localhost:3000'

export interface ILumanAPI {
  // авторы
  getAuthors: () => Promise<Author[]>;
  getAuthor: (id: number) => Promise<Author>;
  setAuthor: (data: AuthorPartial) => any;
  addAuthor: (data: AuthorRawPartial) => any;
  delAuthor: (id: number) => any;
  // источники
  getSources: () => Promise<Source[]>;
  getSource: (id: number) => Promise<Source>;
  setSource: (data: SourcePartial) => any;
  addSource: (data: SourceRawPartial) => any;
  delSource: (id: number) => any;
  // ключевые слова
  getKeywords: () => Promise<Keyword[]>;
  getKeyword: (id: number) => Promise<Keyword>;
  setKeyword: (data: KeywordPartial) => any;
  addKeyword: (data: KeywordRawPartial) => any;
  delKeyword: (id: number) => any;
  // идеи
  getIdeas: () => Promise<Idea[]>;
  getIdea: (id: number) => Promise<Idea>;
  setIdea: (data: IdeaPartial) => any;
  addIdea: (data: IdeaRawPartial) => any;
  delIdea: (id: number) => any;
  // авторизация
  login: (data: LoginData) => Promise<ServerResponse<LoginResult>>;
  getUser: () => Promise<User>;
  logout: () => Promise<Success>;
}

export class LumanAPI extends Api implements ILumanAPI {
  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  // **********************************************
  // * Авторизация
  // **********************************************
  login = (data: LoginData): Promise<ServerResponse<LoginResult>> => {
    return this.request(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
  }

  getUser = () : Promise<User> => {
		return this.requestWithRefresh<User>('/auth/user', {
			method: 'GET',
			headers: { Authorization: `Bearer ${getCookie('accessToken')}` }
		});
  }

  logout = () : Promise<Success> => {
		return this.request<Success>('/auth/logout', {
			method: 'POST',
      credentials: 'include' 
		});
  }


  // **********************************************
  // * Авторы 
  // **********************************************

  getAuthors = (): Promise<Author[]> => {
    return this.request<Author[]>(`/authors`, { method: 'GET' });
  };

  getAuthor = (id: number): Promise<Author> => {
    return this.request<Author>(`/authors/${id}`, { method: 'GET' })
  };

  addAuthor = (data: AuthorRawPartial) => {
    return this.requestWithRefresh('/authors/', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    });
  };

  setAuthor = (data: AuthorPartial) => {
    console.log('setAuthor',data)
    return this.requestWithRefresh(`/authors/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    });
  }

  delAuthor = (id: number) => {
    return this.requestWithRefresh(`/authors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getCookie('accessToken')}` }
    });
  };

  // **********************************************
  // * Источники
  // **********************************************

  getSources = (): Promise<Source[]> => {
    return this.request<Source[]>(`/sources`, { method: 'GET' })
  };

  getSource = (id: number): Promise<Source> => {
    return this.request<Source>(`/sources/${id}`, { method: 'GET' })
  }

  addSource = (data: SourceRawPartial) => {
    return this.requestWithRefresh('/sources/', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    });
  };

  setSource = (data: SourcePartial) => {
    return this.requestWithRefresh(`/sources/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    });
  };

  delSource = (id: number) => {
    return this.requestWithRefresh(`/sources/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getCookie('accessToken')}` }
    });
  };

  // **********************************************
  // * Идеи
  // **********************************************

  getIdeas = (): Promise<Idea[]> => {
    return this.request<Idea[]>(`/ideas`, { method: 'GET' })
  };

  getIdea = (id: number): Promise<Idea> => {
    return this.request<Idea>(`/ideas/${id}`, { method: 'GET' })
  };

  addIdea = (data: IdeaRawPartial) => {
    return this.requestWithRefresh('/ideas/', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    });
  };

  setIdea = (data: IdeaPartial) => {
    return this.requestWithRefresh(`/ideas/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    });
  };

  delIdea = (id: number) => {
    return this.requestWithRefresh(`/ideas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getCookie('accessToken')}` }
    });
  };

  // **********************************************
  // * Ключевые слова
  // **********************************************

  getKeywords = (): Promise<Keyword[]> => {
    return this.request<Keyword[]>(`/keywords`, { method: 'GET' })
  };

  getKeyword = (id: number): Promise<Keyword> => {
    return this.request<Keyword>(`/keywords/${id}`, { method: 'GET' })
  };

  addKeyword = (data: KeywordRawPartial) => {
    return this.requestWithRefresh('/keywords/', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    });
  };


  setKeyword = (data: KeywordPartial) => {
    return this.requestWithRefresh(`/keywords/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken')}`
      }
    });
  };

  delKeyword = (id: number) => {
    return this.requestWithRefresh(`/keywords/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getCookie('accessToken')}` }
    });
  };
}

type TAuthorsResponse = { data: Author[] };

export default new LumanAPI(URL_API);
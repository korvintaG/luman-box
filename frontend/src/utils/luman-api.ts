import { Author, AuthorPartial, AuthorRawPartial, Source, Idea, IdeaRaw, IdeaPartial, IdeaRawPartial,
  SourceRaw, 
  Keyword, KeywordRawPartial, SourceRawPartial, SourcePartial, KeywordPartial } from "./type";

const URL_API='http://localhost:3000'

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => {
    if (err.message) {
      if (Array.isArray(err.message)) {
        return Promise.reject({...err, message:err.message.join(';')})    
      }
    }
    return Promise.reject(err)
  });


type TAuthorsResponse = {data: Author[]};

  

// **********************************************
// * Авторы 
// **********************************************

export const getAuthorsAPI = () : Promise<Author[]> => {
    return fetch(`${URL_API}/authors`)
    .then((res) => checkResponse<Author[]>(res))
    .then((data) => data);
  }; 

export const getAuthorAPI = (id:number) : Promise<Author> => {
  return fetch(`${URL_API}/authors/${id}`)
  .then((res) => checkResponse<Author>(res))
  }; 

export const setAuthorAPI = (data: AuthorPartial)  => {
    return fetch(`${URL_API}/authors/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res) => checkResponse(res))
  }; 

  export const addAuthorAPI = (data: AuthorRawPartial) => {
    return fetch(`${URL_API}/authors/`, {
      method: 'POST',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res) => checkResponse(res))
  };   

  export const delAuthorAPI = (id: number) => {
    return fetch(`${URL_API}/authors/${id}`, {
      method: 'DELETE'
    })
    .then((res) => checkResponse(res))
  };   

  
// **********************************************
// * Источники
// **********************************************

  export const getSourcesAPI = () : Promise<Source[]> => {
    return fetch(`${URL_API}/sources`)
    .then((res) => checkResponse<Source[]>(res))
  };  

  export const getSourceAPI = (id:number) : Promise<Source> => {
    return fetch(`${URL_API}/sources/${id}`)
    .then((res) => checkResponse<Source>(res))
    } 

  export const setSourceAPI = (data: SourcePartial)  => {
    return fetch(`${URL_API}/sources/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res) => checkResponse(res))
  }; 

  export const addSourceAPI = (data: SourceRawPartial) => {
    return fetch(`${URL_API}/sources/`, {
      method: 'POST',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res) => checkResponse(res))
  };   

  export const delSourceAPI = (id: number) => {
    return fetch(`${URL_API}/sources/${id}`, {
      method: 'DELETE'
    })
    .then((res) => checkResponse(res))
  };   

// **********************************************
// * Идеи
// **********************************************

export const getIdeasAPI = () : Promise<Idea[]> => {
    return fetch(`${URL_API}/ideas`)
    .then((res) => checkResponse<Idea[]>(res))
}; 

export const getIdeaAPI = (id:number) : Promise<Idea> => {
    return fetch(`${URL_API}/ideas/${id}`)
    .then((res) => checkResponse<Idea>(res))
}; 

export const setIdeaAPI = (data: IdeaPartial)  => {
    return fetch(`${URL_API}/ideas/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res) => checkResponse(res))
}; 

export const addIdeaAPI = (data: IdeaRawPartial) => {
    return fetch(`${URL_API}/ideas/`, {
      method: 'POST',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res) => checkResponse(res))
};   

export const delIdeaAPI = (id: number) => {
  return fetch(`${URL_API}/ideas/${id}`, {
    method: 'DELETE'
  })
  .then((res) => checkResponse(res))
};   


// **********************************************
// * Ключевые слова
// **********************************************

export const getKeywordsAPI = () : Promise<Keyword[]> => {
    return fetch(`${URL_API}/keywords`)
    .then((res) => checkResponse<Keyword[]>(res))
  }; 

export const getKeywordAPI = (id:number) : Promise<Keyword> => {
    return fetch(`${URL_API}/keywords/${id}`)
    .then((res) => checkResponse<Keyword>(res))
}; 

export const setKeywordAPI = (data: KeywordPartial)  => {
    return fetch(`${URL_API}/keywords/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res) => checkResponse(res))
}; 

export const addKeywordAPI = (data: KeywordRawPartial) => {
    return fetch(`${URL_API}/keywords/`, {
      method: 'POST',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res) => checkResponse(res))
};   

export const delKeywordAPI = (id: number) => {
  return fetch(`${URL_API}/keywords/${id}`, {
    method: 'DELETE'
  })
  .then((res) => checkResponse(res))
};   

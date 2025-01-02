import { Author, Source, Idea, IdeaRaw, SourceRaw, Keyword } from "./type";

const URL_API='http://localhost:3000'

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));


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
  .then((res)=>res)
  }; 

export const setAuthorAPI = (data: {id:number, name: string})  => {
    return fetch(`${URL_API}/authors/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({name: data.name}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
  .then((res)=>res.json())
  }; 

  export const addAuthorAPI = (name: string) => {
    return fetch(`${URL_API}/authors/`, {
      method: 'POST',
      body: JSON.stringify({name}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res)=>res.json())
  };   

  export const delAuthorAPI = (id: number) => {
    return fetch(`${URL_API}/authors/${id}`, {
      method: 'DELETE'
    })
    .then((res)=>res.json())    
  };   

  
// **********************************************
// * Источники
// **********************************************

  export const getSourcesAPI = () : Promise<Source[]> => {
    return fetch(`${URL_API}/sources`)
    .then((res)=>res.json())
  };  

  export const getSourceAPI = (id:number) : Promise<Source> => {
    return fetch(`${URL_API}/sources/${id}`)
    .then((res)=>res.json())
    } 

  export const setSourceAPI = (data: Source)  => {
    return fetch(`${URL_API}/sources/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
  .then((res)=>res.json())
  }; 

  export const addSourceAPI = (data: SourceRaw) => {
    return fetch(`${URL_API}/sources/`, {
      method: 'POST',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res)=>res.json())
  };   

  export const delSourceAPI = (id: number) => {
    return fetch(`${URL_API}/sources/${id}`, {
      method: 'DELETE'
    })
    .then((res)=>res.json())    
  };   

// **********************************************
// * Идеи
// **********************************************

export const getIdeasAPI = () : Promise<Idea[]> => {
    return fetch(`${URL_API}/ideas`)
    .then((res)=>res.json())
}; 

export const getIdeaAPI = (id:number) : Promise<Idea> => {
    return fetch(`${URL_API}/ideas/${id}`)
    .then((res)=>res.json())
}; 

export const setIdeaAPI = (data: Idea)  => {
    return fetch(`${URL_API}/ideas/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
  .then((res)=>res.json())
}; 

export const addIdeaAPI = (data: IdeaRaw) => {
    return fetch(`${URL_API}/ideas/`, {
      method: 'POST',
      body: JSON.stringify({...data}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res)=>res.json())
};   

export const delIdeaAPI = (id: number) => {
  return fetch(`${URL_API}/ideas/${id}`, {
    method: 'DELETE'
  })
  .then((res)=>res.json())    
};   


// **********************************************
// * Ключевые слова
// **********************************************

export const getKeywordsAPI = () : Promise<Keyword[]> => {
    return fetch(`${URL_API}/keywords`)
    .then((res)=>res.json())
}; 

export const getKeywordAPI = (id:number) : Promise<Keyword> => {
    return fetch(`${URL_API}/keywords/${id}`)
    .then((res)=>res.json())
}; 

export const setKeywordAPI = (data: {id:number, name: string})  => {
    return fetch(`${URL_API}/keywords/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
  .then((res)=>res.json())
}; 

export const addKeywordAPI = (name: string) => {
    return fetch(`${URL_API}/keywords/`, {
      method: 'POST',
      body: JSON.stringify({name}),
      headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then((res)=>res.json())
};   

export const delKeywordAPI = (id: number) => {
  return fetch(`${URL_API}/keywords/${id}`, {
    method: 'DELETE'
  })
  .then((res) => checkResponse(res))
  .then((res)=>res)    
};   

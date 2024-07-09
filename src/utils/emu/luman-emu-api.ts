import {authorsCur, setName, addAuthor, delAuthor} from './authors-data';
import { sourcesExtension, setSource, addSource, delSource} from './sources-data';
import {ideas, ideasExtension, setIdea, addIdea, delIdea} from './ideas-data';
import {keywords, setKeywordName, addKeyword, delKeyword} from './keywords-data';

import {Idea, Keyword, IdeaEditData, Author, SourceExtension, Source, SourceEditData, IdeaExtension} from '../type';


// **********************************************
// * Авторы 
// **********************************************

export const getAuthorsAPI = () : Promise<Author[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(authorsCur), 500);
    });
  }; 

export const getAuthorAPI = (id:number) : Promise<Author> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(authorsCur.find((el)=>(el.id===id))!), 500);
    });
  }; 

export const setAuthorAPI = (data: {id:number, name: string})  => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setName(data.id, data.name);
        return resolve(data)}, 500);
      });
  }; 

  export const addAuthorAPI = (name: string) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(addAuthor(name)), 500);
    });
  };   

  export const delAuthorAPI = (id: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => 
      {
        const sourceCorr=sourcesExtension.find((el)=>el.author_id===id);
        if (sourceCorr)
          return reject(new Error(`Нельзя удалять автора, за которым закреплен источник [${sourceCorr.name}]!`))
        else
          return resolve(delAuthor(id));
      }
      , 500);
    });
  };   

// **********************************************
// * Источники
// **********************************************

  export const getSourcesAPI = () : Promise<SourceExtension[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(sourcesExtension), 500);
    });
  }; 

  export const getSourceAPI = (id:number) : Promise<SourceExtension> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(sourcesExtension.find((el)=>(el.id===id))!), 500);
    });
  }; 

  export const setSourceAPI = (data: Source)  => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSource(data);
        return resolve(data)}, 500);
      });
  }; 

  export const addSourceAPI = (data: SourceEditData) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(addSource(data)), 500);
    });
  };   

  export const delSourceAPI = (id: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ideaCorr=ideas.find((el)=>el.source_id===id);
        if (ideaCorr)
          return reject(new Error(`Нельзя удалять источник, за которым закреплена идея [${ideaCorr.name}]!`))
        else
          return resolve(delSource(id))
      }, 500);
    });

  };   

// **********************************************
// * Идеи
// **********************************************

export const getIdeasAPI = () : Promise<IdeaExtension[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(ideasExtension), 500);
  });
}; 

export const getIdeaAPI = (id:number) : Promise<IdeaExtension> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(ideasExtension.find((el)=>(el.id===id))!), 500);
  });
}; 

export const setIdeaAPI = (data: Idea)  => {
  return new Promise((resolve) => {
    setTimeout(() => {
      setIdea(data);
      return resolve(data)}, 500);
    });
}; 

export const addIdeaAPI = (data: IdeaEditData) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(addIdea(data)), 500);
  });
};   

export const delIdeaAPI = (id: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(delIdea(id)), 500);
  });
};   


// **********************************************
// * Ключевые слова
// **********************************************

export const getKeywordsAPI = () : Promise<Keyword[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(keywords), 500);
  });
}; 

export const getKeywordAPI = (id:number) : Promise<Keyword> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(keywords.find((el)=>(el.id===id))!), 500);
  });
}; 

export const setKeywordAPI = (data: {id:number, name: string})  => {
  return new Promise((resolve) => {
    setTimeout(() => {
      setKeywordName(data.id, data.name);
      return resolve(data)}, 500);
    });
}; 

export const addKeywordAPI = (name: string) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(addKeyword(name)), 500);
  });
};   

export const delKeywordAPI = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => 
        resolve(delKeyword(id))
    , 500);
  });
};   

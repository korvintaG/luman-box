import {authors} from './data';
import {Author} from './type';

export const getAuthors = () : Promise<Author[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(authors), 1000);
    });
  }; 

export const getAuthor = (id:number) : Promise<Author> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(authors.find((el)=>(el.id===id))!), 1000);
    });
  }; 

export const setAuthor = (id:number, name: string) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(authors.find((el)=>(el.id===id))!.name=name), 1000);
    });
  }; 
import {  Author,  AuthorPartial,  AuthorRawPartial}  from '../AuthorTypes'
import { Api } from '../../../shared/api/api'; 
import { getCookie } from '../../../shared/utils/cookie'; 

export const API_URL = process.env.REACT_APP_API_URL!;

export interface IAuthorAPI {
  getAuthors: () => Promise<Author[]>;
  getAuthor: (id: number) => Promise<Author>;
  setAuthor: (data: AuthorPartial) => any;
  addAuthor: (data: AuthorRawPartial) => any;
  delAuthor: (id: number) => any;
  approveAuthor: (id: number) => any;
  rejectAuthor: (id: number) => any;
}

export class AuthorAPI extends Api implements IAuthorAPI {

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

}



const authorAPI=new AuthorAPI(API_URL);
export default authorAPI;

import {Keyword,  KeywordRawPartial,  KeywordPartial} from '../KeywordTypes'
import { Api } from '../../../shared/api/api'; 
import { getCookie } from '../../../shared/utils/cookie'; 

export const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";

export interface IKeywordAPI {
  getKeywords: () => Promise<Keyword[]>;
  getKeyword: (id: number) => Promise<Keyword>;
  setKeyword: (data: KeywordPartial) => any;
  addKeyword: (data: KeywordRawPartial) => any;
  delKeyword: (id: number) => any;
  approveKeyword: (id: number) => any;
}

export class KeywordAPI extends Api implements IKeywordAPI {

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
    console.log('setKeyword',data)
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



const keywordAPI=new KeywordAPI(API_URL);
export default keywordAPI;

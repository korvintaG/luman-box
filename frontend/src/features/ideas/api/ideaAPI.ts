import { Idea,    IdeaForList,IdeaPartial,  IdeaRawPartial, UserAttitude,  UserAttitudeIdea} 
from '../IdeaTypes'
import { Api } from '../../../shared/api/api'; 
import { getCookie } from '../../../shared/utils/cookie'; 
import { omit } from "lodash";
import { generatePath } from "react-router-dom";

export const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";

export interface IIdeaAPI {
  getIdeas: () => Promise<Idea[]>;
  getIdea: (id: number) => Promise<Idea>;
  setIdea: (data: IdeaPartial) => any;
  addIdea: (data: IdeaRawPartial) => any;
  delIdea: (id: number) => any;
  getIdeaForList : (id: number) => Promise<IdeaForList>;
  approveIdea: (id: number) => any;
}

export class IdeaAPI extends Api implements IIdeaAPI {
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
    return this.requestWithRefresh<Idea>(`/ideas/${id}`, { 
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

  getIdeaForList = (id: number) : Promise<IdeaForList> => {
    const route=generatePath('/ideas/for-list/:id',{
      id:String(id)
    });
    return this.request<IdeaForList>(route, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };


  attitudeIdea = (userAttitudeIdea: UserAttitudeIdea) =>{
    const bod=omit(userAttitudeIdea,'id');
    //console.log('attitudeIdea',userAttitudeIdea,bod)
    return this.requestWithRefresh(`/attitudes/${userAttitudeIdea.id}`, {
      method: "POST",
      body: JSON.stringify({ ...omit(userAttitudeIdea,'id')}),      
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}` 
      },
    });

  }


}



const ideaAPI=new IdeaAPI(API_URL);
export default ideaAPI;

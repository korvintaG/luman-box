import { IdeaAdd, IdeaDetail, IdeaDetailPartial, IdeaForList, IdeaList, IdeaPlain, IdeaShort, UserAttitude,  UserAttitudeIdea} 
from '../types/IdeaTypes'
import { getCookie } from '../../../shared/utils/cookie'; 
import { omit } from "lodash";
import { generatePath } from "react-router-dom";
import { EntityAPI, IEntityAPI } from '../../../shared/api/entity-api';

export interface IIdeaAPI extends IEntityAPI<
  IdeaAdd, IdeaPlain, 
  IdeaDetailPartial, IdeaDetail,
  undefined, IdeaList[]> 
{
  getIdeaForList : (id: number) => Promise<IdeaForList>;
}

export class IdeaAPI extends EntityAPI<
    IdeaAdd, IdeaPlain, 
    IdeaDetailPartial, IdeaDetail,
    undefined, IdeaList[]> 
  implements IIdeaAPI {

  constructor() {
    super("ideas");
  }

  getIdeasBySrcKw = (cond: {
    source_id: number;
    keyword_id: number;
  }): Promise<IdeaList[]> => {
    return this.requestWithRefresh<IdeaList[]>(
      `/ideas?source_id=` + cond.source_id + "&keyword_id=" + cond.keyword_id,
      { method: "GET" },
    );
  };

  getIdeaBySourceKeyword = (findCond: {
    source_id: number;
    keyword_id: number;
  }): Promise<IdeaDetail> => {
    return this.requestWithRefresh<IdeaDetail>(
      `/ideas/find-by-source-kw/${findCond.source_id}/${findCond.keyword_id}`,
      { method: "GET" },
    );
  };

  getIdeaForList = (id: number) : Promise<IdeaForList> => {
    const route=generatePath('/ideas/for-list/:id',{
      id:String(id)
    });
    return this.requestWithRefresh<IdeaForList>(route, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  attitudeIdea = (userAttitudeIdea: UserAttitudeIdea): Promise<UserAttitudeIdea> =>{
    const bod=omit(userAttitudeIdea,'id');
    //console.log('attitudeIdea',userAttitudeIdea,bod)
    return this.requestWithRefresh<UserAttitudeIdea>(`/attitudes/${userAttitudeIdea.id}`, {
      method: "POST",
      body: JSON.stringify({ ...omit(userAttitudeIdea,'id')}),      
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}` 
      },
    });
  }
}

const ideaAPI=new IdeaAPI();
export default ideaAPI;

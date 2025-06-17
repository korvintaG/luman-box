import { IdeaForList } from '../../ideas/IdeaTypes';
import {IdeaInterconnectionsPar,  IdeaInterconnections,  IdeaInterconnectionByIdeaIDPar,  InterconnectionCreateDTO,  InterconnectionEditData,  InterconnectionUpdateDTO}
from "../InterconnectionTypes";
import { Api } from '../../../shared/api/api'; 
import { getCookie } from '../../../shared/utils/cookie'; 
import { omit } from "lodash";
import { generatePath } from "react-router-dom";

export const API_URL = process.env.REACT_APP_API_URL!;

export interface IInterconnectionAPI {
  getIdeaInterconnections: (parameters: IdeaInterconnectionsPar) => any;
  getInterconnectionIdeaByID : (parameters: IdeaInterconnectionByIdeaIDPar) => Promise<IdeaForList>;
  addInterconnection: (interconnectionCreateDTO:InterconnectionCreateDTO) =>any;
  getInterconnection :(id: number) => Promise<InterconnectionEditData>;
  setInterconnection :(interconnectionUpdateDTO: InterconnectionUpdateDTO) => any;
  delInterconnection :(id: number) => any;
  approveInterconnection: (id: number) => any;
}

export class InterconnectionAPI extends Api implements IInterconnectionAPI {

  getIdeaInterconnections = (parameters: IdeaInterconnectionsPar) : Promise<IdeaInterconnections> => {
    const route=generatePath('/interconnections/by-idea-and-type/:id/:tid',{
      id:String(parameters.ideaID),
      tid:String(parameters.interconnectionTypeID)
    });
    return this.request<IdeaInterconnections>(route, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  getInterconnectionIdeaByID = (parameters: IdeaInterconnectionByIdeaIDPar) : Promise<IdeaForList> => {
    const route=generatePath('/interconnections/idea-for-interconnect/:id/:tid/:iid',{
      id:String(parameters.ideaCurrentID),
      tid:String(parameters.interconnectionTypeID),
      iid:String(parameters.ideaToInterconnectID)
    });
    return this.request<IdeaForList>(route, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  addInterconnection = (interconnectionCreateDTO:InterconnectionCreateDTO) => {
    return this.requestWithRefresh('/interconnections/', {
      method: "POST",
      body: JSON.stringify({ ...interconnectionCreateDTO }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  }

  getInterconnection = (id: number) : Promise<InterconnectionEditData> => {
    const route=generatePath('/interconnections/:id',{id:String(id)});
    return this.requestWithRefresh<InterconnectionEditData>(route, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  }

  setInterconnection =(interconnectionUpdateDTO: InterconnectionUpdateDTO) => {
    const route=generatePath('/interconnections/:id',{id:String(interconnectionUpdateDTO.id)});
    return this.requestWithRefresh<InterconnectionEditData>(route, {
      method: "PATCH",
      body: JSON.stringify({ ...omit(interconnectionUpdateDTO,'id') }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  }

  delInterconnection = (id: number) => {
    return this.requestWithRefresh(`/interconnections/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
    });
  };

  approveInterconnection = (id: number) => {
    return this.requestWithRefresh(`/interconnections/moderate/${id}?action=approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };


}

const interconnectionAPI=new InterconnectionAPI(API_URL);
export default interconnectionAPI;

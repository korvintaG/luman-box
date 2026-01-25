import { DeleteEntityResponse, IDObject, IModerate, ModerateEntityResponse } from "../types/entity-types";
import { getCookie } from "../utils/cookie";
import { Api } from "./api";

export const API_URL = process.env.REACT_APP_API_URL!;
 
export interface IEntityAPI <
  EntityAdd, 
  EntityDetailPartial extends IDObject, 
  EntityDetail, 
  ListParam, 
  EntityList> {
    addEntity: (data: EntityAdd) => Promise<EntityDetail>;
    getEntity: (id: number) => Promise<EntityDetail>;
    getEntities: (params: ListParam) => Promise<EntityList>;
    setEntity: (data: EntityDetailPartial) => Promise<EntityDetail>;
    delEntity: (id: number) => Promise<DeleteEntityResponse>;
    approveEntity: (data: IModerate) => Promise<ModerateEntityResponse>;
    rejectEntity: (data: IModerate) => Promise<ModerateEntityResponse>;
    toModerateEntity: (id: number) => Promise<ModerateEntityResponse>;
  }
  
export abstract class EntityAPI<
  EntityAdd, 
  EntityDetailPartial extends IDObject, 
  EntityDetail,
  ListParam, 
  EntityList> extends Api 
  implements IEntityAPI<EntityAdd, 
  EntityDetailPartial, 
  EntityDetail, 
  ListParam, 
  EntityList> {

  constructor(protected readonly entity: string) {
        super(API_URL);
  }

  protected getQueryListString = (params: ListParam): string => {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    console.log("queryParams base class", queryParams);
    return queryParams;
  };

  getEntities = (params: ListParam): Promise<EntityList> => {
    let queryString = "";
    if (params) {
      queryString = `?${this.getQueryListString(params)}`;
    }
    return this.requestWithRefresh<EntityList>(`/${this.entity}${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  }; 



  getEntity = (id: number): Promise<EntityDetail> => {
    return this.requestWithRefresh<EntityDetail>(`/${this.entity}/${id}`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  addEntity = (data: EntityAdd) => {
        return this.requestWithRefresh<EntityDetail>(`/${this.entity}/`, {
          method: "POST",
          body: JSON.stringify({ ...data }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
        });
  };

  setEntity = (data: EntityDetailPartial) => {
        console.log("setEntity", data);
        return this.requestWithRefresh<EntityDetail>(`/${this.entity}/${data.id}`, {
          method: "PATCH",
          body: JSON.stringify({ ...data }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
        });
  };
    

  delEntity = (id: number) => {
        return this.requestWithRefresh<DeleteEntityResponse>(`/${this.entity}/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
        });
  };

  approveEntity = (data: IModerate) => {
        const moderationRecordIdPar = data.moderationRecordID ? 
          `&moderation_record_id=${data.moderationRecordID}`
          :'';
        return this.requestWithRefresh<ModerateEntityResponse>(
          `/${this.entity}/moderate/${data.id}?action=approve&notes=${encodeURIComponent(data.notes)}${moderationRecordIdPar}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
        });
  };
    
  rejectEntity = (data: IModerate) => {
        const moderationRecordIdPar = data.moderationRecordID ? 
        `&moderation_record_id=${data.moderationRecordID}`
        :'';
        return this.requestWithRefresh<ModerateEntityResponse>(
          `/${this.entity}/moderate/${data.id}?action=reject&notes=${encodeURIComponent(data.notes)}${moderationRecordIdPar}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
        });
  };

  toModerateEntity = (id: number) => {
        return this.requestWithRefresh<ModerateEntityResponse>(`/${this.entity}/to-moderate/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
        });
  };

}    
    
  
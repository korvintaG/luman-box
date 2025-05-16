import { Source,SourceRawPartial,  SourcePartial} from '../SourceTypes'
import { Api } from '../../../shared/api/api'; 
import { getCookie } from '../../../shared/utils/cookie'; 

export const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";

export interface ISourceAPI {
  getSources: () => Promise<Source[]>;
  getSource: (id: number) => Promise<Source>;
  setSource: (data: SourcePartial) => any;
  addSource: (data: SourceRawPartial) => any;
  delSource: (id: number) => any;
  approveSource: (id: number) => any;
}

export class SourceAPI extends Api implements ISourceAPI {

  getSources = (): Promise<Source[]> => {
    return this.request<Source[]>(`/sources`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  getSource = (id: number): Promise<Source> => {
    return this.request<Source>(`/sources/${id}`, { method: "GET" });
  };

  addSource = (data: SourceRawPartial) => {
    return this.requestWithRefresh("/sources/", {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  setSource = (data: SourcePartial) => {
    return this.requestWithRefresh(`/sources/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  approveSource = (id: number) => {
    return this.requestWithRefresh(`/sources/moderate/${id}?action=approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  rejectSource = (id: number) => {
    return this.requestWithRefresh(`/sources/moderate/${id}?action=reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  delSource = (id: number) => {
    return this.requestWithRefresh(`/sources/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
    });
  };
}

const sourceAPI=new SourceAPI(API_URL);
export default sourceAPI;

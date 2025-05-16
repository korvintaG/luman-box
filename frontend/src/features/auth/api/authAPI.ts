import { ServerResponse,  Success} from '../../../shared/common-types'
import {LoginData,LoginResult,User, } from '../user-types'
import { Api } from '../../../shared/api/api'; 
import { getCookie } from '../../../shared/utils/cookie'; 

export const API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3000";

export interface IAuthAPI {
  login: (data: LoginData) => Promise<ServerResponse<LoginResult>>;
  getUser: () => Promise<User>;
  logout: () => Promise<Success>;
}

export class AuthAPI extends Api implements IAuthAPI {

  // **********************************************
  // * Авторизация
  // **********************************************
  login = (data: LoginData): Promise<ServerResponse<LoginResult>> => {
    return this.request(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  };

  getUser = (): Promise<User> => {
    return this.requestWithRefresh<User>("/auth/user", {
      method: "GET",
      headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
    });
  };

  logout = (): Promise<Success> => {
    return this.request<Success>("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  };



}

const authAPI=new AuthAPI(API_URL);
export default authAPI;

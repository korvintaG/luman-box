//import {Error} from 'react-dom'
import { getCookie, setCookie } from "../utils/cookie";
import { UserResponseToken } from "../../features/auth/user-types";
import { isArray } from "lodash";

export const enum RequestStatus {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Failed = "failed",
}

export type FetchError = {
  message: string;
  statusCode: number;
};

export class Api {
  private readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      headers: {
        ...((options.headers as object) ?? {}),
      },
    };
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      // Для статуса 204 (No Content) возвращаем пустой объект
      if (response.status === 204) {
        return Promise.resolve({} as T);
      }
      // Для других успешных статусов пытаемся парсить JSON
      return response.json();
    } else {
      return response
        .json()
        .then((err) =>
          Promise.reject({ ...err, statusCode: response.status }),
        );
    }    
    /*return response.ok
      ? response.json()
      : response
          .json()
          .then((err) =>
            Promise.reject({ ...err, statusCode: response.status }),
          );*/
  }

  async request<T>(endpoint: string, options: RequestInit) {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...this.options,
        ...options,
      });
      return await this.handleResponse<T>(res);
    } catch (error) {
      const fetchError = error as FetchError;

      return Promise.reject({
        ...fetchError,
        statusCode: fetchError.statusCode || 500,
        message: isArray(fetchError.message) ? fetchError.message.join('; ') : fetchError.message || 'Unknown error',
      });
    }
  }

  private refreshToken = () => {
    return this.request<UserResponseToken>("/auth/token", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }); 
  };

  protected requestWithRefresh = async <T>(
    endpoint: string,
    options: RequestInit,
  ) => {
    try {
      return await this.request<T>(endpoint, options);
    } catch (error) {
      console.log('requestWithRefresh error', error);
      const fetchError = error as FetchError;
      // Если ошибка не 401, то не пытаемся обновлять токен
      if (fetchError.statusCode !== 401) {
        return Promise.reject(error/*{
          ...fetchError,
          statusCode: fetchError.statusCode || 500,
          //message: isArray(fetchError.message) ? fetchError.message.join('\n') : fetchError.message || 'Unknown error --',
        }*/);  
      }
      
      try {
        // Пытаемся обновить токен
        const refreshData = await this.refreshToken();
        
        if (!refreshData.success) {
          // Если refresh не удался, очищаем cookies
          setCookie("accessToken", "", { expires: new Date(0) });
          setCookie("refreshToken", "", { expires: new Date(0) });
          return Promise.reject({
            statusCode: 401,
            message: "Authentication failed. Please login again."
          });
        }
        
        // Обновляем токен в cookies
        setCookie("accessToken", refreshData.access_token);
        
        // Повторяем исходный запрос с новым токеном
        return await this.request<T>(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${refreshData.access_token}`,
          },
        });
      } catch (refreshError) {
        // Если refresh токен тоже не работает, очищаем cookies
        setCookie("accessToken", "", { expires: new Date(0) });
        setCookie("refreshToken", "", { expires: new Date(0) });
        
        return Promise.reject({
          statusCode: 401,
          message: "Session expired. Please login again."
        });
      }
    }
  };
}

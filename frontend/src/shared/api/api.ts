//import {Error} from 'react-dom'
import { getCookie, setCookie } from "../utils/cookie";
import { UserResponseToken } from "../../features/auth/user-types";

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

  protected handleResponse<T>(response: Response): Promise<T> {
    return response.ok
      ? response.json()
      : response
          .json()
          .then((err) =>
            Promise.reject({ ...err, statusCode: response.status }),
          );
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
        statusCode: fetchError.statusCode,
        message: fetchError.message,
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
      const fetchError = error as FetchError;
      
      // Если ошибка не 401, то не пытаемся обновлять токен
      if (fetchError.statusCode !== 401) {
        return Promise.reject(fetchError);
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

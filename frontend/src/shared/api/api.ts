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
        StatusCode: fetchError.statusCode,
        message: `${fetchError.statusCode}. ${fetchError.message}`,
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
      const refreshData = await this.refreshToken();
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      setCookie("accessToken", refreshData.access_token);
      return await this.request<T>(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${getCookie("accessToken")}`,
        },
      });
    }
  };
}

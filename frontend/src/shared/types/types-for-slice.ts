import { RequestStatusValue } from "./types-for-hooks";

export interface SliceList<T> {
    list: T[];
    status: RequestStatusValue;
    error: string;
  }
  
  export interface SliceDetail<T> {
    current: T | null | undefined;
    status: RequestStatusValue;
    error: string;
    newID?: number; // id новой записи
  }
  
import { ChangeEvent, SyntheticEvent } from "react";
import { EditAccessStatus } from "../utils/utils";
import { User } from "../../features/auth/user-types";

export type HTMLEditElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export const enum RequestStatus {
  Idle = "idle",
  Loading = "loading",
  Finding = "finding",
  Success = "success",
  Failed = "failed",
  FailedUpdate = "failedUpdate",
  FailedAdd = "failedAdd",
  FailedDelete = "failedDelete",
  FailedFind = "failedFind",
  FailedUnAuth = "failedUnAuth",
  Updated = "updated",
  Added = "added",
  Deleted = "deleted",
  Attituding = "attituding",
  Attituded = "attituded",
  SendToModerating = "sendToModerating",
}

export type RequestStatusKey = keyof typeof RequestStatus;
export type RequestStatusValue = (typeof RequestStatus)[RequestStatusKey];


export type Success = {
    success: boolean;
  };
  
export type ServerResponse<T> = Success & T;

export interface DetailsHookProps {
  id?: string;
  currentUser: User | null;
}

export interface IFormHookRes<FormValues> {
  values: FormValues,
  handleChange: (event: ChangeEvent<HTMLEditElement>) => void;
  setValues:(newValues: FormValues)=>void;
  editStarted: boolean;
  setEditStarted: (editStarted: boolean) => void;
}

export interface IDetailsAddHookRes<FormValues, Record> {
  form: IFormHookRes<FormValues>,
  record: {
    id?: number; // старое ID
    newID?: number; // новое ID определенное после добавления
    fetchRecord: ()=>void;
    handleSubmitAction: (e:SyntheticEvent) => void;
    currentRecord: Record | null | undefined;
  },
  status: {
    sliceStates: RequestStatus[];
    errorText: string;
  }
}

export interface IDetailsEditHookRes<FormValues, Record> extends IDetailsAddHookRes<FormValues, Record>{
  record: IDetailsAddHookRes<FormValues, Record>['record'] & {
    deleteRecordAction: (e:SyntheticEvent) => void;
  },
  status:  IDetailsAddHookRes<FormValues, Record>['status'] & {
    resetSlicesStatus: () => void; // сбросить статусы срезов
    editAccessStatus: EditAccessStatus; 
  }
  moderate: {
    approveRecordAction: (e:SyntheticEvent) => void;
    rejectRecordAction: (e:SyntheticEvent) => void;
    toModerateRecordAction: (e:SyntheticEvent) => void;
  }
}

export interface IDetailsWithPhotoHookRes<FormValues, Record> extends
  IDetailsEditHookRes<FormValues, Record> {
  record: IDetailsEditHookRes<FormValues, Record>['record'] & {
    uploadFileAction: (data: FormData) => void;
  }
  /*status: IDetailsEditHookRes<FormValues, Record>['status'] & {
    resetSlicesStatus: () => void; // сбросить статусы срезов
  }*/
}

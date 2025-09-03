import { SyntheticEvent } from "react";
import {
    EditAccessStatus,
  } from "../../../utils/utils";
import { IDetailsEditHookRes, IDetailsWithPhotoHookRes, RequestStatusValue } from "../../../types/types-for-hooks";

export type RecordControlBlockProps<T> = {
    gotoEntityList: () => void;
    gotoEntityEdit: (id: number) => void;
    entityDetailsHook: T extends IDetailsEditHookRes<any, any> ? T : never; 
  };
  
  
import { Dispatch } from "@reduxjs/toolkit";
import { useState, SyntheticEvent, SetStateAction } from "react";

// что возвращает хук?
export type useMsgModalRes = {
  dialogWasOpened: boolean; // открыто ли соотв. модальное окно?
  openDialog: (e: SyntheticEvent) => void; // функция открытия
  closeDialog: () => void; // закрытия
  openDialogDirectly: () => void; // закрытия
};

export function useMsgModal(): useMsgModalRes {
  const [dialogWasOpened, setMsgOpened] = useState(false);

  const openDialog = (e: SyntheticEvent) => {
    e.preventDefault();
    setMsgOpened(true);
  };

  const openDialogDirectly = () => {
    setMsgOpened(true);
  }

  const closeDialog = () => setMsgOpened(false);
  return { dialogWasOpened, openDialog, closeDialog, openDialogDirectly } as useMsgModalRes;
}

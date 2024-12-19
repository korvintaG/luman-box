import {useState, SyntheticEvent} from 'react';

export type useMsgModalRes={
    dialogWasOpened: boolean; // открыто ли соотв. модальное окно?
    openDialog: (e: SyntheticEvent) => void // функция открытия
    closeDialog: () => void // закрытия 
}

export function useMsgModal():useMsgModalRes {
    const [dialogWasOpened, setMsgOpened] = useState(false);

    const openDialog = (e: SyntheticEvent) => {
        e.preventDefault();
        setMsgOpened(true);
    }

    const closeDialog = () => setMsgOpened(false);
    return {dialogWasOpened, openDialog, closeDialog } as useMsgModalRes;

}
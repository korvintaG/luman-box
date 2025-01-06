import { FC,  SyntheticEvent } from 'react';
import {Preloader} from '../preloader';
import { ErrorMessageUI } from '../error-message/error-message'
import { MsgQuestionUIProps} from '../msg-question/msg-question'
import { MsgQuestionUI } from '../../../../components/ui/uni/msg-question/msg-question'
import styles from './edit-form.module.css';
import { RequestStatus, isRequestFailed, isDMLRequestOK } from '../../../../utils/type'

export interface SimpleErrorProps {
    text: string | null;    
    fetchRecord:()=>void;
}

export type EditFormStatusProps = {
    sliceState:RequestStatus;
    children: React.ReactNode;
    isLoading:boolean;
    error: string | null;
    fetchRecord:()=>void;
    resetSliceState:()=>void;
    isDeleteDialog: boolean;
    deleteDialogProps: MsgQuestionUIProps;
}

export const EditFormStatus: FC<EditFormStatusProps> = (props:EditFormStatusProps) => {
    if (props.isLoading )
        return <Preloader/>; 

    if (isDMLRequestOK(props.sliceState))
        return <h2 className={styles.ok_message}>Операция успешно завершена</h2>

    let errorTitle='Ошибка'
    let okAction=props.resetSliceState;
    switch (props.sliceState) {
        case RequestStatus.FailedAdd:
            errorTitle='Ошибка добавления новой записи';
            break
        case RequestStatus.FailedUpdate:
            errorTitle= 'Ошибка изменения записи'
            break
        case RequestStatus.FailedDelete:
            errorTitle= 'Ошибка удаления записи'
            okAction=props.fetchRecord;
            break
        case RequestStatus.Failed:
            errorTitle= 'Ошибка запроса данных'
            okAction=props.fetchRecord;
            break
        default:
            errorTitle= 'Ошибка неизвестного типа'
    }
    

    const handleRefresh = (e: SyntheticEvent) => {
        e.preventDefault();
        okAction();
    }

    if (isRequestFailed(props.sliceState)) {
        let okCaption='OK';
        if (props.sliceState===RequestStatus.FailedUpdate)
            okCaption= "Продолжить редактирование"
        if (props.sliceState===RequestStatus.FailedAdd)
            okCaption= "Продолжить добавление"
        if (props.sliceState===RequestStatus.FailedDelete)
            okCaption= "Вернуться к записи"
            if (props.sliceState===RequestStatus.Failed)
            okCaption= "Повтор запроса"
        return <ErrorMessageUI 
                    errorTitle={errorTitle}
                    error={props.error}
                    okCaption={okCaption}
                    okAction={handleRefresh}
                />
    }

    return <>
    {props.isDeleteDialog && 
                <MsgQuestionUI 
                    yesIsAlert
                    {...props.deleteDialogProps}
    />}
    {props.children}
    </>
}
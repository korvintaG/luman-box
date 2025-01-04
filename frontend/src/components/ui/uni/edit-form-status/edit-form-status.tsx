import { FC,  SyntheticEvent } from 'react';
import {Preloader} from '../preloader';
import { ErrorMessageUI } from '../error-message/error-message'
import { MsgQuestionUIProps} from '../msg-question/msg-question'
import { MsgQuestionUI } from '../../../../components/ui/uni/msg-question/msg-question'

export interface SimpleErrorProps {
    title?: string | undefined;
    text: string | null;    
    fetchRecord:()=>void;
}

export type EditFormStatusProps = {
    children: React.ReactNode;
    isLoading:boolean;
    isError: boolean;
    errorProps: SimpleErrorProps;
    isDeleteDialog: boolean;
    deleteDialogProps: MsgQuestionUIProps;
}

export const EditFormStatus: FC<EditFormStatusProps> = (props:EditFormStatusProps) => {
    if (props.isLoading )
        return <Preloader/>; 

    const handleRefresh = (e: SyntheticEvent) => {
        e.preventDefault();
        props.errorProps.fetchRecord();
    }

    if (props.isError)
    return <ErrorMessageUI 
                errorTitle={props.errorProps.title}
                error={props.errorProps.text}
                okAction={handleRefresh}
            />

    return <>
    {props.isDeleteDialog && 
                <MsgQuestionUI 
                    yesIsAlert
                    {...props.deleteDialogProps}
    />}
    {props.children}
    </>
}
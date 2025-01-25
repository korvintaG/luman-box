import { useEffect, SyntheticEvent, ComponentType, ReactElement } from 'react';
import { isDMLRequestOK, RequestStatus } from '../../utils/type'
import { EditFormStatus } from '../../components/ui/uni/edit-form-status/edit-form-status'
import { useMsgModal } from '../../hooks/useMsgModal'
import { appRoutes } from '../../AppRoutes';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { resetAuth } from '../../slices/auth/index';

export type WidthFormStatusProps = {
    listPath: string;
    fetchRecord: () => void;
    isLoading: boolean;
    sliceState: RequestStatus;
    error: string | null;
    deleteQuestion: string;
    deleteRecord: (e: SyntheticEvent) => void;
    resetSliceState: () => void;
}

export function withFormStatus<P>
    (WrappedComponent: ComponentType<P>) {
    return function (props: P & WidthFormStatusProps): ReactElement {
        const msgDeleteHook = useMsgModal();
        const navigate = useNavigate();
        const dispatch = useDispatch();

        useEffect(() => {
            if (isDMLRequestOK(props.sliceState))
                navigate(props.listPath);
        }, [props.sliceState, navigate]);


        return (<EditFormStatus
            sliceState={props.sliceState}
            isLoading={props.isLoading}
            error={props.error}
            fetchRecord={props.fetchRecord}
            resetSliceState={props.resetSliceState}
            isDeleteDialog={msgDeleteHook.dialogWasOpened}
            authPath={appRoutes.auth}
            resetAuth={()=>dispatch(resetAuth())}
            deleteDialogProps={{
                question: props.deleteQuestion,
                action: props.deleteRecord,
                closeAction: msgDeleteHook.closeDialog
            }}>
            <WrappedComponent {...props} deleteRecord={msgDeleteHook.openDialog} />
        </EditFormStatus>)
    }
};


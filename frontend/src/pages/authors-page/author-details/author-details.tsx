import { useEffect, useState, SyntheticEvent } from 'react';
import { useParams, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '../../../components/ui/uni/preloader';
import { AuthorDetailsUI } from '../../../components/ui/details/author-details/author-details'
import { useSelector, useDispatch } from '../../../services/store';
import { MsgQuestionUI } from '../../../components/ui/uni/msg-question/msg-question'
import { ErrorMessageUI } from '../../../components/ui/uni/error-message/error-message'
import { useMsgModal } from '../../../hooks/useMsgModal'
import {
    setAuthor, selectCurrentAuthor, delAuthor, selectError,
    selectIsDataLoading, getAuthor, addAuthor, selectSliceState
} from '../../../slices/authors';
import { appRoutes } from '../../../AppRoutes';
import { RequestStatus } from '../../../utils/type'
import { EditFormStatus } from '../../../components/ui/uni/edit-form-status/edit-form-status'


/**
 * Компонент редактирования автора - данные + UI
 */
export const AuthorDetails = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const msgDeleteHook = useMsgModal();
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const sliceState = useSelector(selectSliceState);
    const errorText = useSelector(selectError);
    const currentAuthor = useSelector(selectCurrentAuthor);
    const dispatch = useDispatch();

    const fetchAuthor= ()=>{
        if (id)
            dispatch(getAuthor(Number(id)))
    }

    useEffect(() => fetchAuthor(), []);

    useEffect(() => {
        if (sliceState===RequestStatus.Updated)
            navigate(appRoutes.authors);            
    }, [sliceState]);


    useEffect(() => {
        if (currentAuthor)
            setName(currentAuthor.name)
    }, [currentAuthor]);

    const deleteAuthor = (e: SyntheticEvent) => {
        e.preventDefault();
        dispatch(delAuthor(Number(id)));
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id)
            dispatch(setAuthor({ id: Number(id), name: name }));
        else
            dispatch(addAuthor(name));
    }

    const initialName=currentAuthor ? currentAuthor.name : '';

    return (<EditFormStatus 
        wasUpdated={sliceState === RequestStatus.Updated}        
        isLoading={isLoading }
        isError={sliceState===RequestStatus.Failed}
        errorProps={{
            title:`Ошибка удаления автора [${name}]:`,
            text:errorText,
            fetchRecord:fetchAuthor
        }}
        isDeleteDialog={msgDeleteHook.dialogWasOpened}
        deleteDialogProps={{
            question:`Удалить автора [${initialName}]?`,
            action:deleteAuthor ,
            closeAction:msgDeleteHook.closeDialog
        }}
        >
                <AuthorDetailsUI 
                    id={id ? Number(id) : null} 
                    name={name}
                    initialName={initialName}
                    error={errorText} 
                    setName={setName}
                    handleSubmit={handleSubmit} 
                    deleteAuthor={msgDeleteHook.openDialog} />
            </EditFormStatus>)
            
}

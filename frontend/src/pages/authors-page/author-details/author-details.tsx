import { useEffect, useState, SyntheticEvent } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { AuthorDetailsUI } from '../../../components/ui/details/author-details/author-details'
import { useSelector, useDispatch } from '../../../services/store';
import { useMsgModal } from '../../../hooks/useMsgModal'
import {
    setAuthor, selectCurrentAuthor, delAuthor, selectError, setStateSuccess,
    selectIsDataLoading, getAuthor, addAuthor, selectSliceState
} from '../../../slices/authors';
import { selectCurrentUser } from '../../../slices/auth/index';
import { appRoutes } from '../../../AppRoutes';
import { isDMLRequestOK, AuthorRaw, RequestStatus } from '../../../utils/type'
import { EditFormStatus } from '../../../components/ui/uni/edit-form-status/edit-form-status'
import { useForm } from "../../../hooks/useForm";


/**
 * Компонент редактирования автора - данные + UI
 */
export const AuthorDetails = () => { 
    const { id } = useParams();
    const { values, handleChange, setValues, getFormDTO } = useForm<AuthorRaw>({
        name: ""
      });
    
    const msgDeleteHook = useMsgModal();
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const sliceState = useSelector(selectSliceState);
    const errorText = useSelector(selectError);
    const currentUser = useSelector(selectCurrentUser);
    const currentAuthor = useSelector(selectCurrentAuthor);
    const dispatch = useDispatch();

    const fetchAuthor= ()=>{
        if (id)
            dispatch(getAuthor(Number(id)))
    }

    const resetSliceState =()=> dispatch(setStateSuccess());

    useEffect(() => fetchAuthor(), []);

    useEffect(() => {
        if (isDMLRequestOK(sliceState))
            navigate(appRoutes.authors);            
    }, [sliceState]);

    useEffect(() => {
        if (currentAuthor)
        setValues({
            ...currentAuthor
          })
    }, [currentAuthor]);

    const deleteAuthor = (e: SyntheticEvent) => {
        e.preventDefault();
        dispatch(delAuthor(Number(id)));
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id)
            dispatch(setAuthor({ ...getFormDTO(), id: Number(id)}));
        else
            dispatch(addAuthor({...getFormDTO(), user:{id:currentUser!.id}}));
    }

    const initialName=currentAuthor ? currentAuthor.name : '';

    return (<EditFormStatus 
        sliceState={sliceState}        
        isLoading={isLoading }
        error={errorText}
        fetchRecord={fetchAuthor}
        resetSliceState={resetSliceState}
        isDeleteDialog={msgDeleteHook.dialogWasOpened}
        authPath={appRoutes.auth}
        deleteDialogProps={{
            question:`Удалить автора [${initialName}]?`,
            action:deleteAuthor ,
            closeAction:msgDeleteHook.closeDialog
        }}
        >
                <AuthorDetailsUI 
                    id={id ? Number(id) : null} 
                    readOnly={!currentUser}
                    values={values}
                    initialName={initialName}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit} 
                    deleteAuthor={msgDeleteHook.openDialog} />
            </EditFormStatus>)
}
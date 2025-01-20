import { useParams } from 'react-router';
import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeywordDetailsUI } from '../../../components/ui/details/keyword-details/keyword-details'
import { useMsgModal } from '../../../hooks/useMsgModal'
import { useSelector, useDispatch } from '../../../services/store';
import {
    setKeyword,selectCurrentKeyword, delKeyword, selectError, setStateSuccess,
    selectIsDataLoading, getKeyword, addKeyword, selectSliceState
  } from '../../../slices/keywords';
import { appRoutes } from '../../../AppRoutes';
import { isDMLRequestOK, KeywordRaw} from '../../../utils/type'
import { EditFormStatus } from '../../../components/ui/uni/edit-form-status/edit-form-status'
import { useForm } from "../../../hooks/useForm";
import { selectCurrentUser } from '../../../slices/auth/index';


export const KeywordDetails = () => {
    const { id } = useParams(); 
    const { values, handleChange, setValues, getFormDTO } = useForm<KeywordRaw>({
        name: ""
      });

    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const sliceState = useSelector(selectSliceState);
    const errorText = useSelector(selectError);
    const msgDeleteHook = useMsgModal();
    const currentUser = useSelector(selectCurrentUser);
    const error = useSelector(selectError);
    const currentKeyword = useSelector(selectCurrentKeyword);
    const dispatch = useDispatch();

    const fetchKeyword= ()=>{
        if (id) {
            const idNumber = Number(id);
            dispatch(getKeyword(idNumber))
        }
    }

    const resetSliceState =()=> dispatch(setStateSuccess());

    useEffect(() => fetchKeyword(),[]);

    useEffect(() => { 
        if (isDMLRequestOK(sliceState))
            navigate(appRoutes.keywords);            
    }, [sliceState]);


    useEffect(() => {
        if (currentKeyword)
            setValues({
            ...currentKeyword
              })

    },[currentKeyword]);

    const deleteKeyword = (e: SyntheticEvent) => {
            const idNumber = Number(id);
            dispatch(delKeyword(idNumber))
    }


    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id) {
            const idNumber = Number(id);
            dispatch(setKeyword({ ...getFormDTO(), id: Number(id)}));
        }
        else {
            dispatch(addKeyword({ ...getFormDTO()}));
        }
    }

    const initialName=currentKeyword? currentKeyword.name: '';

    return (<EditFormStatus 
        sliceState={sliceState}        
        isLoading={isLoading }
        error={errorText}
        fetchRecord={fetchKeyword}
        resetSliceState={resetSliceState}
        isDeleteDialog={msgDeleteHook.dialogWasOpened}
        authPath={appRoutes.auth}
        deleteDialogProps={{
            question:`Удалить ключевое слово [${initialName}]?`,
            action:deleteKeyword ,
            closeAction:msgDeleteHook.closeDialog
        }}
    >
        <KeywordDetailsUI 
            id={id?Number(id):null } 
            readOnly={!currentUser}
            values={values}
            initialName={initialName}
            handleChange={handleChange}
            handleSubmit={handleSubmit} 
            deleteKeyword={msgDeleteHook.openDialog}/>
        </EditFormStatus>);
}

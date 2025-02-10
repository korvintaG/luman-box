import { useParams } from 'react-router';
import { useEffect, useMemo, SyntheticEvent } from 'react';
import { KeywordDetailsUIFC } from '../../../components/ui/details/keyword-details/keyword-details'
import { useSelector, useDispatch } from '../../../services/store';
import {
    setKeyword,selectCurrentKeyword, delKeyword, selectError, setStateSuccess, approveKeyword, rejectKeyword,
    getKeyword, addKeyword, selectSliceState
  } from '../../../slices/keywords';
import { appRoutes } from '../../../AppRoutes';
import { KeywordRaw, RequestStatus} from '../../../utils/type'
import { useForm } from "../../../hooks/useForm";
import { selectCurrentUser } from '../../../slices/auth/index';
import {withFormStatus} from '../../../components/hocs/with-form-status'
import { omit }  from "lodash";
import { getEditAccess, getUserCreator } from '../../../utils/utils';

export const KeywordDetails = () => {
    const { id } = useParams(); 
    const { values, handleChange, setValues, getFormDTO } = useForm<KeywordRaw>({
        name: ""
      });

    const sliceState = useSelector(selectSliceState);
    const errorText = useSelector(selectError);
    const currentUser = useSelector(selectCurrentUser);
    const currentKeyword = useSelector(selectCurrentKeyword);
    const dispatch = useDispatch();

    const fetchKeyword= ()=>{
        if (id) 
            dispatch(getKeyword(Number(id)))
    }

    const resetSliceState =()=> dispatch(setStateSuccess());

    useEffect(() => fetchKeyword(),[]);

    useEffect(() => {
        if (currentKeyword)
            setValues({
            ...omit(currentKeyword,'user')
              })

    },[currentKeyword]);

    const deleteKeyword = (e: SyntheticEvent) => {
            dispatch(delKeyword(Number(id)))
    }

    const approveRecord = (e: SyntheticEvent) => {
        dispatch(approveKeyword(Number(id)))
    }

    const rejectRecord = (e: SyntheticEvent) => {
        dispatch(rejectKeyword(Number(id)))
    }


    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id) 
            dispatch(setKeyword({ ...getFormDTO(), id: Number(id)}));
        else 
            dispatch(addKeyword({ ...getFormDTO()}));
    }

    const initialName=currentKeyword? currentKeyword.name: '';
    const KeywordForm = useMemo(()=>withFormStatus(KeywordDetailsUIFC),[setValues]);
  
    return ( 
        <KeywordForm
            listPath={appRoutes.keywords}
            id={id ? Number(id) : null} 
            fetchRecord={fetchKeyword}
            isLoading={sliceState===RequestStatus.Loading}
            sliceState={sliceState}
            error={errorText}
            editAccessStatus={getEditAccess(id,currentUser,currentKeyword)}
            values={values}
            initialName={initialName}
            handleChange={handleChange}
            handleSubmit={handleSubmit} 
            deleteQuestion={`Удалить ключевое слово [${initialName}]?`}
            deleteRecord={deleteKeyword}
            approveRecord={approveRecord}
            rejectRecord={rejectRecord}
            resetSliceState={resetSliceState}
            userName={getUserCreator(currentKeyword, currentUser)}
            />
      )
    

}

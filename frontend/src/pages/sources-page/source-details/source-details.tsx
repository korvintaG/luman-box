import { useParams } from 'react-router';
import { useMemo, useEffect, SyntheticEvent } from 'react';
import { SourceDetailsUIFC } from '../../../components/ui/details/source-details/source-details'
import { useSelector, useDispatch } from '../../../services/store';
import {
    setSource,selectCurrentSource, delSource, selectError, setStateSuccess,
    selectIsDataLoading, getSource, addSource, selectSliceState
  } from '../../../slices/sources';
import {
    selectAuthors, 
    fetchAuthors, 
    selectIsDataLoading as selectIsAuthorLoading
  } from '../../../slices/authors';
import { SourceRaw} from '../../../utils/type'
import {useForm} from '../../../hooks/useForm';
import { appRoutes } from '../../../AppRoutes';
import { selectCurrentUser } from '../../../slices/auth/index';
import {withFormStatus} from '../../../components/hocs/with-form-status'
import { omit }  from "lodash";
import { allowEdit, getUserCreator } from '../../../utils/utils';

export const SourceDetails = () => {

    const { id } = useParams();
    const { values, handleChange, setValues, getFormDTO } = useForm<SourceRaw>({
        name: '',
        author: {id: 0}
      });
    
    const isLoading = useSelector(selectIsDataLoading);
    const sliceState =  useSelector(selectSliceState);
    const isAuthorLoading = useSelector(selectIsAuthorLoading);
    const currentSource = useSelector(selectCurrentSource);
    const currentUser = useSelector(selectCurrentUser);
    const authors= useSelector(selectAuthors);
    const errorText = useSelector(selectError);
    const dispatch = useDispatch();

    const fetchSource= ()=>{
        if (id) {
            const idNumber = Number(id);
            dispatch(getSource(idNumber))
        }
    }

    const resetSliceState =()=> dispatch(setStateSuccess());

    useEffect(() => {
        if (authors.length===0)
            dispatch(fetchAuthors());
        fetchSource();
    },[]);  

    useEffect(() => {
        if (currentSource)
            setValues({...omit(currentSource, ['user']), author:{id: (currentSource.author?currentSource.author.id:0)}})
    },[currentSource]);

    const deleteSourceAction = (e: SyntheticEvent) => {
            const idNumber = Number(id);
            dispatch(delSource(idNumber))
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id) 
            dispatch(setSource({...getFormDTO(), id: Number(id) }))
        else 
            dispatch(addSource({...getFormDTO(), user: {id: currentUser!.id}}));
    }

    const initialName=currentSource ? currentSource.name : '';
    const SourceForm = useMemo(()=>withFormStatus(SourceDetailsUIFC),[setValues]);

    return ( 
        <SourceForm
            listPath={appRoutes.sources}
            id={id ? Number(id) : null} 
            fetchRecord={fetchSource}
            isLoading={isLoading || isAuthorLoading}
            sliceState={sliceState}
            error={errorText}
            readOnly={!allowEdit(id,currentUser,currentSource)}
            values={values}
            initialName={initialName}
            handleChange={handleChange}
            handleSubmit={handleSubmit} 
            deleteQuestion={`Удалить источник [${initialName}]?`}
            deleteRecord={deleteSourceAction}
            resetSliceState={resetSliceState}
            authors={authors}
            userName={getUserCreator(currentSource, currentUser)}

        />
      )



}



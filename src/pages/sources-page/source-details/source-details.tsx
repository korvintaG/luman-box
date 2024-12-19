import { useParams } from 'react-router';
import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SourceDetailsUI } from '../../../components/ui/details/source-details/source-details'
import {Preloader} from '../../../components/ui/uni/preloader';
import { useSelector, useDispatch } from '../../../services/store';
import { useMsgModal } from '../../../hooks/useMsgModal'
import {
    setSource,selectCurrentSource, delSource, selectError,
    selectIsDataLoading, getSource, addSource
  } from '../../../slices/sources';
import {
    selectAuthors,
    fetchAuthors,
    selectIsDataLoading as aLoading
  } from '../../../slices/authors';
import { MsgQuestionUI } from '../../../components/ui/uni/msg-question/msg-question'
import { SourceEditData} from '../../../utils/type'
import {useForm} from '../../../hooks/useForm';
import { appRoutes } from '../../../AppRoutes';


export const SourceDetails = () => {
    const msgDeleteHook = useMsgModal();

    const { id } = useParams();
    const { values, handleChange, setValues } = useForm<SourceEditData>({
        name: '',
        author_id: 0
      });
    
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const isALoading = useSelector(aLoading);
    const currentSource = useSelector(selectCurrentSource);
    const authors= useSelector(selectAuthors);
    const error = useSelector(selectError);
    const dispatch = useDispatch();

    useEffect(() => {
        if (authors.length===0)
            dispatch(fetchAuthors());
        if (id) {
            const idNumber = Number(id);
            dispatch(getSource(idNumber))
        }
    },[]);

    useEffect(() => {
        if (currentSource)
            setValues({name: currentSource.name, author_id: currentSource.author_id})
    },[currentSource]);

    
    const deleteSourceAction = (e: SyntheticEvent) => {
            const idNumber = Number(id);
            dispatch(delSource(idNumber))
            .unwrap()
            .then(() => navigate(appRoutes.sources))
            .catch(() => { });
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id) {
            const idNumber = Number(id);
            //console.log('handleSubmit',values);
            dispatch(setSource({id: idNumber, author_id: Number(values.author_id), name:values.name})).
            then(()=> {
                navigate(appRoutes.sources);
            })
        }
        else {
            dispatch(addSource(values));
            navigate(appRoutes.sources);
        }
    }
    if (isLoading || isALoading)
        return <Preloader/>;

    return (<>
            {msgDeleteHook.dialogWasOpened && 
                <MsgQuestionUI 
                    question={`Удалить источник [${values.name}]`}
                    yesIsAlert
                    action={deleteSourceAction} 
                    closeAction={msgDeleteHook.closeDialog} />}
            <SourceDetailsUI 
                id={id?Number(id):null } 
                values={values} 
                initialName={currentSource? currentSource.name+' // '+currentSource.authorName:''}
                error={error}
                handleChange={handleChange}
                handleSubmit={handleSubmit} 
                deleteSource={msgDeleteHook.openDialog} 
                authors={authors}/>
            </>);
}

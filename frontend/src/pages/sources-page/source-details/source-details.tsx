import { useParams } from 'react-router';
import { useEffect, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SourceDetailsUI } from '../../../components/ui/details/source-details/source-details'
import {Preloader} from '../../../components/ui/uni/preloader';
import { useSelector, useDispatch } from '../../../services/store';
import { useMsgModal } from '../../../hooks/useMsgModal'
import {
    setSource,selectCurrentSource, delSource, selectError,
    selectIsDataLoading, getSource, addSource, selectSliceState
  } from '../../../slices/sources';
import {
    selectAuthors,
    fetchAuthors, 
    selectIsDataLoading as aLoading
  } from '../../../slices/authors';
import { MsgQuestionUI } from '../../../components/ui/uni/msg-question/msg-question'
import { RequestStatus, SourceEditData, authorNameFromObj} from '../../../utils/type'
import {useForm} from '../../../hooks/useForm';
import { appRoutes } from '../../../AppRoutes';


export const SourceDetails = () => {
    const msgDeleteHook = useMsgModal();

    const { id } = useParams();
    const { values, handleChange, setValues } = useForm<SourceEditData>({
        name: '',
        author: {id: 0}
      });
    
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const sliceState =  useSelector(selectSliceState);
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
        if (sliceState===RequestStatus.Updated)
            navigate(appRoutes.sources);            
    }, [sliceState]);

    useEffect(() => {
        if (currentSource)
            setValues({name: currentSource.name, author:{id: (currentSource.author?currentSource.author.id:0)}})
    },[currentSource]);

    
    const deleteSourceAction = (e: SyntheticEvent) => {
            const idNumber = Number(id);
            dispatch(delSource(idNumber))
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id) {
            const idNumber = Number(id);
            dispatch(setSource({id: idNumber, name:values.name, author:{id: Number(values.author?values.author.id:0)}}))
        }
        else 
            dispatch(addSource(values));
        
    }
    if (isLoading || isALoading )
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
                initialName={currentSource? (currentSource.name+' // '+authorNameFromObj(currentSource.author)):''}
                error={error}
                handleChange={handleChange}
                handleSubmit={handleSubmit} 
                deleteSource={msgDeleteHook.openDialog} 
                authors={authors}/>
            </>);
}

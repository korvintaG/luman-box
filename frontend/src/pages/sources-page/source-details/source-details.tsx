import { useParams } from 'react-router';
import { useEffect, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SourceDetailsUI } from '../../../components/ui/details/source-details/source-details'
import { useSelector, useDispatch } from '../../../services/store';
import { useMsgModal } from '../../../hooks/useMsgModal'
import {
    setSource,selectCurrentSource, delSource, selectError, setStateSuccess,
    selectIsDataLoading, getSource, addSource, selectSliceState
  } from '../../../slices/sources';
import {
    selectAuthors,
    fetchAuthors, 
    selectIsDataLoading as aLoading
  } from '../../../slices/authors';
import { isDMLRequestOK, Source, SourceRaw, sourceFullNameFromObj, SourceRawPartial} from '../../../utils/type'
import {useForm} from '../../../hooks/useForm';
import { appRoutes } from '../../../AppRoutes';
import { EditFormStatus } from '../../../components/ui/uni/edit-form-status/edit-form-status'


export const SourceDetails = () => {
    const msgDeleteHook = useMsgModal();

    const { id } = useParams();
    const { values, handleChange, setValues, getFormDTO } = useForm<SourceRaw>({
        name: '',
        author: {id: 0}
      });
    
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const sliceState =  useSelector(selectSliceState);
    const isALoading = useSelector(aLoading);
    const currentSource = useSelector(selectCurrentSource);
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
        if (isDMLRequestOK(sliceState))
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
        if (id) 
            dispatch(setSource({...getFormDTO(), id: Number(id) }))
        else 
            dispatch(addSource(getFormDTO()));            
    }

    return (<EditFormStatus 
                sliceState={sliceState}        
                isLoading={isLoading || isALoading }
                error={errorText}
                fetchRecord={fetchSource}
                resetSliceState={resetSliceState}
                isDeleteDialog={msgDeleteHook.dialogWasOpened}
                deleteDialogProps={{
                    question:`Удалить источник [${values.name}]`,
                    action:deleteSourceAction ,
                    closeAction:msgDeleteHook.closeDialog
                }}
            >
            <SourceDetailsUI 
                id={id?Number(id):null } 
                values={values} 
                initialName={sourceFullNameFromObj(currentSource)}
                handleChange={handleChange}
                handleSubmit={handleSubmit} 
                deleteSource={msgDeleteHook.openDialog} 
                authors={authors}/>
            </EditFormStatus>);
}

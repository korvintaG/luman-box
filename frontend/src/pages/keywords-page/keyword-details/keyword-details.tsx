import { useParams } from 'react-router';
import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeywordDetailsUI } from '../../../components/ui/details/keyword-details/keyword-details'
import { useMsgModal } from '../../../hooks/useMsgModal'
import { useSelector, useDispatch } from '../../../services/store';
import {
    setKeyword,selectCurrentKeyword, delKeyword, selectError,
    selectIsDataLoading, getKeyword, addKeyword, selectSliceState
  } from '../../../slices/keywords';
import { appRoutes } from '../../../AppRoutes';
import { RequestStatus} from '../../../utils/type'
import { EditFormStatus } from '../../../components/ui/uni/edit-form-status/edit-form-status'



export const KeywordDetails = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const sliceState = useSelector(selectSliceState);
    const errorText = useSelector(selectError);
    const msgDeleteHook = useMsgModal();
    const error = useSelector(selectError);
    const currentKeyword = useSelector(selectCurrentKeyword);
    const dispatch = useDispatch();

    const fetchKeyword= ()=>{
        if (id) {
            const idNumber = Number(id);
            dispatch(getKeyword(idNumber))
        }
    }

    useEffect(() => fetchKeyword(),[]);

    useEffect(() => {
        if (sliceState===RequestStatus.Updated)
            navigate(appRoutes.keywords);            
    }, [sliceState]);


    useEffect(() => {
        if (currentKeyword)
            setName(currentKeyword.name)
    },[currentKeyword]);

    const deleteKeyword = (e: SyntheticEvent) => {
            const idNumber = Number(id);
            dispatch(delKeyword(idNumber))
    }


    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id) {
            const idNumber = Number(id);
            dispatch(setKeyword({id: idNumber, name:name}))
        }
        else {
            dispatch(addKeyword(name));
        }
    }

    const initialName=currentKeyword? currentKeyword.name: '';

    return (<EditFormStatus 
        wasUpdated={sliceState === RequestStatus.Updated}        
        isLoading={isLoading }
        isError={sliceState===RequestStatus.Failed}
        errorProps={{
            title:`Ошибка удаления ключевого слова [${name}]:`,
            text:errorText,
            fetchRecord:fetchKeyword
        }}
        isDeleteDialog={msgDeleteHook.dialogWasOpened}
        deleteDialogProps={{
            question:`Удалить ключевое слово [${initialName}]?`,
            action:deleteKeyword ,
            closeAction:msgDeleteHook.closeDialog
        }}
    >
        <KeywordDetailsUI 
            id={id?Number(id):null } 
            name={name}
            initialName={initialName}
            error={error} 
            setName={setName}
            handleSubmit={handleSubmit} 
            deleteKeyword={msgDeleteHook.openDialog}/>
        </EditFormStatus>);
}

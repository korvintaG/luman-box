import { useParams } from 'react-router';
import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeywordDetailsUI } from '../../../components/ui/details/keyword-details/keyword-details'
import {Preloader} from '../../../components/ui/uni/preloader';
import { MsgQuestionUI } from '../../../components/ui/uni/msg-question/msg-question'
import { useMsgModal } from '../../../hooks/useMsgModal'
import { useSelector, useDispatch } from '../../../services/store';
import {
    setKeyword,selectCurrentKeyword, delKeyword, selectError,
    selectIsDataLoading, getKeyword, addKeyword, selectSliceState
  } from '../../../slices/keywords';
import { appRoutes } from '../../../AppRoutes';
import { RequestStatus} from '../../../utils/type'



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

    useEffect(() => {
        if (id) {
            const idNumber = Number(id);
            dispatch(getKeyword(idNumber))
        }
    },[]);

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

    if (isLoading)
        return <Preloader/>;

    if (sliceState===RequestStatus.Failed)
        return <div>{errorText}</div>

    const initialName=currentKeyword? currentKeyword.name: '';

    return (<>
        {msgDeleteHook.dialogWasOpened && 
            <MsgQuestionUI 
                question={`Удалить ключевое слово [${initialName}]?`}
                yesIsAlert
                action={deleteKeyword} 
                closeAction={msgDeleteHook.closeDialog} />}
        <KeywordDetailsUI 
            id={id?Number(id):null } 
            name={name}
            initialName={initialName}
            error={error} 
            setName={setName}
            handleSubmit={handleSubmit} 
            deleteKeyword={msgDeleteHook.openDialog}/>
        </>);
}

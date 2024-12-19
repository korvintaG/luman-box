import { useEffect, useState, SyntheticEvent } from 'react';
import { useParams, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '../../../components/ui/uni/preloader';
import { AuthorDetailsUI } from '../../../components/ui/details/author-details/author-details'
import { useSelector, useDispatch } from '../../../services/store';
import { MsgQuestionUI } from '../../../components/ui/uni/msg-question/msg-question'
import { useMsgModal } from '../../../hooks/useMsgModal'
import {
    setAuthor, selectCurrentAuthor, delAuthor, selectError,
    selectIsDataLoading, getAuthor, addAuthor
} from '../../../slices/authors';
import { appRoutes } from '../../../AppRoutes';

/**
 * Компонент редактирования автора - данные + UI
 */
export const AuthorDetails = () => {
    const location = useLocation();
    const { id } = useParams();
    const [name, setName] = useState('');
    const msgDeleteHook = useMsgModal();
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const error = useSelector(selectError);
    const currentAuthor = useSelector(selectCurrentAuthor);
    const dispatch = useDispatch();

    useEffect(() => {
        if (id)
            dispatch(getAuthor(Number(id)))
    }, []);

    useEffect(() => {
        if (currentAuthor)
            setName(currentAuthor.name)
    }, [currentAuthor]);

    const deleteAuthor = (e: SyntheticEvent) => {
        e.preventDefault();
            dispatch(delAuthor(Number(id)))
                .unwrap()
                .then(() => navigate(appRoutes.authors))
                .catch(() => { });
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id)
            dispatch(setAuthor({ id: Number(id), name: name }));
        else
            dispatch(addAuthor(name));
        navigate(appRoutes.authors);
    }

    if (isLoading)
        return <Preloader />;

    const initialName=currentAuthor ? currentAuthor.name : '';

    return (<>
                {msgDeleteHook.dialogWasOpened && 
                    <MsgQuestionUI question={`Удалить автора [${initialName}]?`}
                        yesIsAlert
                        action={deleteAuthor} 
                        closeAction={msgDeleteHook.closeDialog} />}
                <AuthorDetailsUI 
                    id={id ? Number(id) : null} 
                    name={name}
                    initialName={initialName}
                    error={error} 
                    setName={setName}
                    handleSubmit={handleSubmit} 
                    deleteAuthor={msgDeleteHook.openDialog} />
            </>)
            
}

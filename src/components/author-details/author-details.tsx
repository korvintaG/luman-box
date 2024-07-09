import { useEffect, useState, SyntheticEvent } from 'react';
import { useParams, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { AuthorDetailsUI } from '../ui/author-details/author-details'
import { useSelector, useDispatch } from '../../services/store';
import {
    setAuthor, selectCurrentAuthor, delAuthor, selectError,
    selectIsDataLoading, getAuthor, addAuthor
} from '../../slices/authors';

/**
 * Компонент редактирования автора - данные + UI
 */
export const AuthorDetails = () => {
    const location = useLocation();
    const { id } = useParams();
    const [name, setName] = useState('');
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
        const confirmBox = window.confirm(
            `Удалить автора [${name}]?`
        )
        if (confirmBox === true) {
            dispatch(delAuthor(Number(id)))
                .unwrap()
                .then(() => navigate('/authors'))
                .catch(() => { });
        }
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id)
            dispatch(setAuthor({ id: Number(id), name: name }));
        else
            dispatch(addAuthor(name));
        navigate('/authors');
    }
    return isLoading ? <Preloader /> :
        <AuthorDetailsUI id={id ? Number(id) : null} name={name}
            initialName={currentAuthor ? currentAuthor.name : ''}
            error={error} setName={setName}
            handleSubmit={handleSubmit} deleteAuthor={deleteAuthor} />
}

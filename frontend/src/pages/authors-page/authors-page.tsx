import { FC, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import { appRoutes } from '../../AppRoutes'
import { useSelector, useDispatch } from '../../services/store';
import {
    selectAuthors,
    fetchAuthors,
    selectIsDataLoading,
    clearCurrentAuthor
} from '../../slices/authors';
import { AuthorListUI } from '../../components/ui/list/author-list'


/**
 * Страница список авторов
 */
export const AuthorsPage: FC = () => {
    const authors = useSelector(selectAuthors);
    const isLoading = useSelector(selectIsDataLoading);
    const location = useLocation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addNewAuthor = () => {
        dispatch(clearCurrentAuthor());
        navigate(appRoutes.authorAdd); 
    }

    useEffect(() => {
        console.log('AuthorsPage useEffect')
        dispatch(fetchAuthors())
    }, [navigate, location]);

    return (
        <AuthorListUI 
            authors={authors}
            addNewAuthor={addNewAuthor}
            isLoading={isLoading}
        />
    );
};

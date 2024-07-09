import { FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Preloader } from '../../components/ui/preloader';
import { useSelector, useDispatch } from '../../services/store';
import {
    selectAuthors,
    fetchAuthors,
    selectIsDataLoading,
    clearCurrentAuthor
} from '../../slices/authors';
import styles from './authors-page.module.css';


/**
 * Страница список авторов
 */
export const Authors: FC = () => {
    const authors = useSelector(selectAuthors);
    const isLoading = useSelector(selectIsDataLoading);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAuthors())
    }, [authors]);

    const addNewAuthor = () => {
        dispatch(clearCurrentAuthor());
        navigate('/authors/add')
    }

    return (
        <main className={clsx(styles.main,'main')}>
            <h1 className='page_header'>Список авторов</h1>
            {isLoading ?
                <Preloader />
                :
                <>
                    <ul className={styles.list}>
                        {authors.map((author) => (<li key={author.id}>
                            <Link
                                className={styles.link}
                                to={`/authors/${author.id}`} >
                                {author.name}
                            </Link>
                        </li>))
                        }

                    </ul>
                    <button className='button_submit' onClick={addNewAuthor}>Добавить автора</button>
                </>}
        </main>

    );
};

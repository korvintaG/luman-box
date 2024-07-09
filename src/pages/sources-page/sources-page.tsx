import { FC, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import { Preloader } from '../../components/ui/preloader';
import { useSelector, useDispatch } from '../../services/store';
import {
    selectSources,
    fetchSources,
    selectIsDataLoading,
    clearCurrentSource
} from '../../slices/sources';
import styles from './sources-page.module.css';

/**
 * Страница список источников
 */
export const Sources: FC = () => {
    const sources = useSelector(selectSources);
    const isLoading = useSelector(selectIsDataLoading);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchSources())
    }, [sources]);

    const addNewSource = () => {
        dispatch(clearCurrentSource());
        navigate('/sources/add')
    }

    return (
        <main className={clsx(styles.main, 'main')}>
            <h1 className='page_header'>Список источников</h1>
            {isLoading ?
                <Preloader />
                :
                <>
                    <ul className={styles.list}>
                        {sources.map((source) => (<li key={source.id}>
                            <Link
                                className={styles.link}
                                to={`/sources/${source.id}`} >
                                {source.name + ' // ' + source.authorName}
                            </Link>
                        </li>))
                        }

                    </ul>
                    <button className='button_submit' onClick={addNewSource}>Добавить источник</button>
                </>}
        </main>

    );
};

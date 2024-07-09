import { FC, useEffect } from 'react';
import {  useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import {Preloader} from '../../components/ui/preloader';
import { useSelector, useDispatch } from '../../services/store';
import {
    selectKeywords,
    fetchKeywords,
    selectIsDataLoading,
    clearCurrentKeyword
  } from '../../slices/keywords';

import styles from './keywords-page.module.css';
  

/**
 * Страница список ключевых слов
 */
export const Keywords: FC = () => {
    const keywords = useSelector(selectKeywords);
    const isLoading = useSelector(selectIsDataLoading);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchKeywords())
    }, [dispatch]);

    const addNewKeyword = () => {
        dispatch(clearCurrentKeyword());
        navigate('/keywords/add')
    }

    return (
        <main className={clsx(styles.main,'main')}>
            <h1 className='page_header'>Список ключевых слов</h1>
            {isLoading ? 
                    <Preloader /> 
                :<>
                    <ul className={styles.list}>
                        {keywords.map((keyword) => (<li key={keyword.id}>
                                        <Link
                                        className={styles.link}
                                        to={`/keywords/${keyword.id}`} >
                                        {keyword.name}
                                        </Link>
                                        </li>))
                        }
                    </ul>
                    <button className='button_submit' onClick={addNewKeyword}>Добавить ключевое слово</button>
                </>}
        </main>

    );
};

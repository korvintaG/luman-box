import { FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {Preloader} from '../../components/ui/preloader';
import { useSelector, useDispatch } from '../../services/store';
import {
    selectIdeas,
    fetchIdeas,
    selectIsDataLoading,
    clearCurrentIdea
  } from '../../slices/ideas';
import styles from './ideas-page.module.css';


/**
 * Страница список идей
 */
export const Ideas: FC = () => {
    const ideas = useSelector(selectIdeas);
    const isLoading = useSelector(selectIsDataLoading);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchIdeas())
    }, [ideas]);

    const addNewIdea = () => {
        dispatch(clearCurrentIdea());
        navigate('/ideas/add')
    }

    return (
        <main className={clsx('main', styles.main)}>
            <h1 className='page_header'>Список идей</h1>
            {isLoading  ? 
                    <Preloader /> 
                    : 
                <>
            <table className={styles.list}>
                <thead>
                    <tr><th>Название идеи</th><th>Источник</th><th>Пользователь</th><th>Добавлено</th></tr>
                </thead>
                <tbody>
                    {ideas.map((idea) => (<tr key={idea.id}>
                            <td>
                                    <Link
                                    className={styles.link}
                                    to={`/ideas/${idea.id}`} >
                                    {idea.name }
                                    </Link>
                            </td>
                            <td>
                                    <Link
                                    className={styles.link}
                                    to={`/sources/${idea.source_id}`} >
                                    {idea.sourceName }
                                    </Link>
                            </td>
                            <td>
                                    <Link
                                    to=''
                                    className={styles.link}>
                                    {idea.user }
                                    </Link>
                            </td>
                            <td className={styles.date_time}>
                                    {idea.date_time_create }
                            </td>
                                    </tr>))
                    }
                </tbody>
            </table>

            <button className='button_submit' onClick={addNewIdea}>Добавить идею</button>
            </>}
        </main>

    );
};

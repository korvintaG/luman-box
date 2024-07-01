import { useLocation } from 'react-router';
import styles from './app-header.module.css';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import logoImg from '../../images/logo.svg';
import authImg from '../../images/auth.svg';



export const AppHeaderUI = () => {
    const location = useLocation();
    return (
        <header className={styles.header}>
            <nav className={`${styles.menu} p-4`}>
                <div className={styles.menu_part_left}>
                    <Link
                        to='/'
                        className={clsx(styles.link, {
                            [styles.link_active]: location.pathname === '/'
                        })}
                    >
                        <img
                            className={styles.img}
                            src={logoImg}
                            alt='логотип сайта'
                        />
                    </Link>
                    <div className={styles.menu_content}>
                        <Link
                            to='/authors'
                            className={clsx(styles.link, {
                                [styles.link_active]: location.pathname === '/authors'
                            })}
                        >
                            <p className='text text_type_main-default ml-2'>Авторы</p>
                        </Link>
                        <Link to='/sources'>
                            <div
                                className={clsx(styles.link_position_last, styles.link, {
                                    [styles.link_active]: location.pathname === '/sources'
                                })}
                            >
                                <p className='text text_type_main-default ml-2'>
                                    Источники
                                </p>
                            </div>
                        </Link>
                        <Link to='/ideas'>
                            <div
                                className={clsx(styles.link_position_last, styles.link, {
                                    [styles.link_active]: location.pathname === '/ideas'
                                })}
                            >
                                <p className='text text_type_main-default ml-2'>
                                    Идеи
                                </p>
                            </div>
                        </Link>
                        <Link to='/keywords'>
                            <div
                                className={clsx(styles.link_position_last, styles.link, {
                                    [styles.link_active]: location.pathname === '/keywords'
                                })}
                            >
                                <p className='text text_type_main-default ml-2'>
                                    Ключевые слова
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
                <Link to='/auth'>
                    <img
                        className={styles.img}
                        src={authImg}
                        alt='иконка авторизации'
                    />
                </Link>
            </nav>
        </header>
    );
};

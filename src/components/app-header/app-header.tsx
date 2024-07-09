import { useLocation } from 'react-router';
import { useState, SyntheticEvent } from 'react';
import styles from './app-header.module.css';
import { LinkActionUI } from '../ui/link-action/link-action';
import clsx from 'clsx';
import logoImg from '../../images/logo.svg';
import authImg from '../../images/auth.svg';


/**
 * Компонент header приложения (меню)
 */
export const AppHeaderUI = () => {
    const [burgerActivated, setBurgerActivated] = useState(false);
    const burgerDeactivate = (e: SyntheticEvent) => setBurgerActivated(false);
    const location = useLocation();

    return (
        <header className={styles.header}>
            <nav className={`${styles.menu} p-4`}>
                <div className={styles.menu_part_left}>
                    <LinkActionUI
                        to='/'
                        actionHandle={burgerDeactivate}
                        className={clsx(styles.link, {
                            [styles.link_active]: location.pathname === '/'
                        })}
                    >
                        <img
                            className={styles.logo}
                            src={logoImg}
                            alt='логотип сайта'
                        />
                    </LinkActionUI>
                    <input id={styles.menu_toggle} type="checkbox" checked={burgerActivated}
                        onChange={(e) => setBurgerActivated(e.target.checked)} />
                    <label className={styles.header__menu_button_container} htmlFor={styles.menu_toggle}>
                        <div className={styles.header__menu_button}></div>
                    </label>
                    <ul className={styles.header__menu}>
                        <li>
                            <LinkActionUI
                                to='/authors'
                                actionHandle={burgerDeactivate}
                                className={clsx(styles.header__menu_item, {
                                    [styles.link_active]: location.pathname === '/authors'
                                })}
                            >
                                Авторы
                            </LinkActionUI>
                        </li>
                        <li>
                            <LinkActionUI
                                to='/sources'
                                actionHandle={burgerDeactivate}
                                className={clsx(styles.link_position_last, styles.header__menu_item, {
                                    [styles.link_active]: location.pathname === '/sources'
                                })}
                            >
                                Источники
                            </LinkActionUI>
                        </li>
                        <li>
                            <LinkActionUI
                                to='/ideas'
                                actionHandle={burgerDeactivate}
                                className={clsx(styles.link_position_last, styles.header__menu_item, {
                                    [styles.link_active]: location.pathname === '/ideas'
                                })}
                            >
                                Идеи
                            </LinkActionUI>
                        </li>
                        <li>
                            <LinkActionUI
                                to='/keywords'
                                actionHandle={burgerDeactivate}
                                className={clsx(styles.link_position_last, styles.header__menu_item, {
                                    [styles.link_active]: location.pathname === '/keywords'
                                })}
                            >
                                Ключевые слова
                            </LinkActionUI>
                        </li>
                    </ul>
                </div>
                <LinkActionUI to='/auth' actionHandle={burgerDeactivate}>
                    <img
                        className={styles.auth}
                        src={authImg}
                        alt='иконка авторизации'
                    />
                </LinkActionUI>
            </nav>
        </header>
    );
};

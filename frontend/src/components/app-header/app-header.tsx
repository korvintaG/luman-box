import { useState, SyntheticEvent } from 'react';
import { useLocation } from 'react-router';
import clsx from 'clsx';
import { appRoutes } from '../../AppRoutes'
import { LinkActionUI } from '../ui/uni/link-action/link-action';
import { MenuItem, BurgerMenuUI } from '../ui/uni/burger-menu/burger-menu'
import styles from './app-header.module.css';
import logoImg from '../../images/logo.svg';
import authImg from '../../images/auth.svg';


/**
 * Компонент header приложения (меню)
 */
export const AppHeaderUI = () => {
    const [burgerActivated, setBurgerActivated] = useState(false);
    const burgerDeactivate = (e: SyntheticEvent) => setBurgerActivated(false);
    const location = useLocation();
    const menu : MenuItem[] = [
        {name:'Авторы', link:appRoutes.authors},
        {name:'Источники', link:appRoutes.sources},
        {name:'Идеи', link:appRoutes.ideas},
        {name:'Ключевые слова', link:appRoutes.keywords},
    ];

    return (
        <header className={styles.header}>
            <nav className={`${styles.menu} p-4`}>
                <div className={styles.menu_part_left}>
                    <LinkActionUI
                        to={appRoutes.home}
                        actionHandle={burgerDeactivate}
                        className={clsx(styles.link, {
                            [styles.link_active]: location.pathname === appRoutes.home
                        })}
                    >
                        <img
                            className={styles.logo}
                            src={logoImg}
                            alt='логотип сайта'
                        />
                    </LinkActionUI>
                    <BurgerMenuUI menu={menu} burgerActivated={burgerActivated} setBurgerActivated={setBurgerActivated}/>
                </div>
                <LinkActionUI to={appRoutes.auth} actionHandle={burgerDeactivate}>
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

import { FC, SyntheticEvent } from 'react';
import { useLocation } from 'react-router';
import { LinkActionUI } from '../../uni/link-action/link-action';
import styles from './burger-menu.module.css';
import clsx from 'clsx';

export type MenuItem = {
    name: string;
    link: string;
}

export type BurgerMenuUIProps = {
    menu: MenuItem[];
    burgerActivated:boolean;
    setBurgerActivated:React.Dispatch<React.SetStateAction<boolean>>;
}

export const BurgerMenuUI: FC<BurgerMenuUIProps> = ({menu, burgerActivated, setBurgerActivated}) => {
    const location = useLocation();

    return <>
    <input id={styles['menu-toggle']} type="checkbox" checked={burgerActivated}
        onChange={(e) => setBurgerActivated(e.target.checked)} />
    <label className={styles['icon-container']} htmlFor={styles['menu-toggle']}>
            <div className={styles.icon}></div>
    </label>
    <ul className={styles.menu}>
        {menu.map((el, cnt) => 
            <li key={cnt}>
                <LinkActionUI
                    to={el.link}
                    actionHandle={(e: SyntheticEvent) => setBurgerActivated(false)}
                    className={clsx(styles.item, {
                        [styles['item-active']]: location.pathname === el.link
                    })}
                >
                    {el.name}
                </LinkActionUI>
            </li>
        )}
    </ul>
    </>
}    

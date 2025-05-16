import { useState, SyntheticEvent, useEffect } from "react";
import { useLocation } from "react-router";
import clsx from "clsx";
import { appRoutes } from "../router/AppRoutes";
import { LinkActionUI } from "../../shared/ui/LinkAction/LinkAction";
import { MenuItem, BurgerMenuUI } from "../../shared/ui/BurgerMenu/BurgerMenu";
import styles from "./AppHeader.module.css";
import logoImg from "../../assets/images/logo.svg";
import authImg from "../../assets/images/auth.svg";
import exitImg from "../../assets/images/exit.svg";
import { useSelector, useDispatch } from "../../shared/services/store";
import { getUser, selectCurrentUser } from "../../features/auth/store/AuthSlice";

/**
 * Компонент header приложения (меню)
 */
export const AppHeaderUI = () => {
  const [burgerActivated, setBurgerActivated] = useState(false);
  const burgerDeactivate = (e: SyntheticEvent) => setBurgerActivated(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const menu: MenuItem[] = [
    { name: "Авторы", link: appRoutes.authors },
    { name: "Источники", link: appRoutes.sources },
    { name: "Идеи", link: appRoutes.ideas },
    { name: "Ключевые слова", link: appRoutes.keywords },
  ];

  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <LinkActionUI
            to={appRoutes.home}
            actionHandle={burgerDeactivate}
            className={clsx(styles.link, {
              [styles.link_active]: location.pathname === appRoutes.home,
            })}
          >
            <img className={styles.logo} src={logoImg} alt="логотип сайта" />
          </LinkActionUI>
          <BurgerMenuUI
            menu={menu}
            burgerActivated={burgerActivated}
            setBurgerActivated={setBurgerActivated}
          />
        </div>
        <LinkActionUI to={appRoutes.auth} actionHandle={burgerDeactivate}>
          {currentUser ? (
            <img
              className={styles.auth}
              src={exitImg}
              alt="иконка выхода из системы"
            />
          ) : (
            <img
              className={styles.auth}
              src={authImg}
              alt="иконка авторизации"
            />
          )}
        </LinkActionUI>
      </nav>
    </header>
  );
};

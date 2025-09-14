import { useState, SyntheticEvent, useEffect } from "react";
import { useLocation } from "react-router";
import clsx from "clsx";
import { appRoutesURL } from "../router/AppRoutesURL";
import { LinkActionUI } from "../../shared/ui/LinkAction/LinkAction";
import { MenuItem, BurgerMenu } from "./BurgerMenu/BurgerMenu";
import styles from "./AppHeader.module.css";
import logoImg from "../../assets/images/logo.svg";
import authImg from "../../assets/images/auth.svg";
import exitImg from "../../assets/images/exit.svg";
import { useSelector, useDispatch } from "../../shared/services/store";
import { getUser, selectCurrentUser } from "../../features/auth/store/AuthSlice";
import WorldBookIcon from "../../shared/ui/icons/WorldBookIcon/WorldBookIcon";
import AuthIcon from "../../shared/ui/icons/AuthIcon/AuthIcon";
import ExitIcon from "../../shared/ui/icons/ExitIcon/ExitIcon";
import { ArrowRightCircleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

/**
 * Компонент header приложения (меню)
 */
export const AppHeaderUI = () => {
  const [burgerActivated, setBurgerActivated] = useState(false);
  const burgerDeactivate = (e: SyntheticEvent) => setBurgerActivated(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const menu: MenuItem[] = [
    { name: "Авторы", link: appRoutesURL.authors, dataCy: "authors-menu" },
    { name: "Источники", link: appRoutesURL.sources, dataCy: "sources-menu" },
    { name: "Идеи", link: appRoutesURL.ideas, dataCy: "ideas-menu" },
    { name: "Ключевые слова", link: appRoutesURL.keywords, dataCy: "keywords-menu" },
  ];

  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <div className={styles.navigation_left}>
          <LinkActionUI
            to={appRoutesURL.home}
            actionHandle={burgerDeactivate}
            data-cy="logo-link"
          >
            <div className={styles.logo_block}>
              <WorldBookIcon className={styles.logo_icon} />
              <div className={styles.logo_text}>
                <p>SFERATUM</p>
                <p>сеть идей</p>
              </div>
            </div>
            {/*alt="логотип сайта"*/}
          </LinkActionUI>
          <BurgerMenu
            menu={menu}
            burgerActivated={burgerActivated}
            setBurgerActivated={setBurgerActivated}
          />
        </div>
        <LinkActionUI to={appRoutesURL.auth} actionHandle={burgerDeactivate} data-cy="auth-button">
          {currentUser ? (
            <ExitIcon
              className={styles.auth}
            />
          ) : (
            <AuthIcon
              className={styles.auth}
            />
          )}
        {/*alt="иконка авторизации" alt="иконка выхода из системы" */}

        </LinkActionUI>
      </nav>
    </header>
  );
};

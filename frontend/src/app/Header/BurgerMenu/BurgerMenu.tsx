import { FC, SyntheticEvent } from "react";
import { useLocation } from "react-router";
import { LinkActionUI } from "../../../shared/ui/LinkAction/LinkAction";
import styles from "./BurgerMenu.module.css";

export type MenuItem = {
  name: string;
  link: string;
};

export type BurgerMenuProps = {
  menu: MenuItem[];
  burgerActivated: boolean;
  setBurgerActivated: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BurgerMenu: FC<BurgerMenuProps> = ({
  menu,
  burgerActivated,
  setBurgerActivated
}) => {
  const location = useLocation();

  return (
    <>
      <input
        id={styles["menu-toggle"]}
        type="checkbox"
        checked={burgerActivated}
        onChange={(e) => setBurgerActivated(e.target.checked)}
      />
      <label
        className={styles["icon-container"]}
        htmlFor={styles["menu-toggle"]}
      >
        <div className={styles.icon}></div>
      </label>
      <ul className={styles.menu}>
        {menu.map((el, cnt) => (
          <li key={cnt}>
            {location.pathname === el.link ? 
              <p className={styles["item-active"]}>{el.name}</p>
              : <LinkActionUI
                  to={el.link}
                  actionHandle={(e: SyntheticEvent) => setBurgerActivated(false)}
                  className={styles.item}
                >
                {el.name}
                </LinkActionUI>
            }
          </li>
        ))}
      </ul>
    </>
  );
};

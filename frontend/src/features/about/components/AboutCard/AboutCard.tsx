import { FC } from "react";
import styles from "./AboutCard.module.css";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { IAboutCard } from "../../AboutCardTypes";

export const AboutCard: FC<IAboutCard> = ({
  title,  titleURL, text, icon: Icon}) => {
        /*style={{
        backgroundImage: `url(${backgroundImage})`,
      }}*/
      

  return <article
      className={clsx(styles.article,'card-container')}
    >
      <div className={styles.header} >
        <div className={styles.overlay}>
          <Link to={titleURL} className={styles.header_block}>
            <div className={styles.card_icon}>
              <Icon className={styles.icon} /> 
            </div>
            <h3 className={styles.title}>{title}</h3>
          </Link>
      </div>

      </div>
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: text }}></div>
      {/*<a href="#" className="card-link">Подробнее <i >-</i></a>*/}
    </article>
  ;
};

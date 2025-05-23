import { FC } from "react";
import styles from "./AboutCard.module.css";
import clsx from "clsx";

export type AboutCardProps = {
  backgroundImage: string;
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
};

export const AboutCard: FC<AboutCardProps> = ({
  backgroundImage,
  Icon,
  title,
  text,
}) => {
        /*style={{
        backgroundImage: `url(${backgroundImage})`,
      }}*/
      

  return (
    <article
      className={clsx(styles.article,'card-container')}
    >
      <div className={styles.header} >
        <div className={styles.overlay}>
          <div className={styles.header_block}>
            <div className={styles.card_icon}>
              <Icon className={styles.icon} /> 
            </div>
            <h3 >{title}</h3>
          </div>
    </div>

      </div>
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: text }}></div>
      {/*<a href="#" className="card-link">Подробнее <i >-</i></a>*/}
    </article>
  );
};

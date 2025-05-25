import { FC } from "react";
import { aboutCardData } from "../../constants/AboutCardData"; 
import { AboutCard } from "../AboutCard/AboutCard";
import styles from "./AboutCardsList.module.css";
import wiki_no from "../../../../assets/images/wiki-no.png";
import { CMSPath, genCMSPath } from "../../../CMS/CMSTypes";
import clsx from "clsx";

/**
 * Страница "о системе"
 */

export const AboutCardsList: FC = () => {
  return (
    <main className={styles.main}>
      <ul className={styles.card_list}>
        {aboutCardData.map((el, cnt) => (
          <li key={cnt} className={styles.list_element}>
            <AboutCard {...el}/>
          </li>
        ))}
      </ul>
      {
        <section className={clsx(styles.wikino,'card-container')}>
          <img src={wiki_no} className={styles.wikino_img} />
          <article className={styles.wikino_article}>
            <h3 className={styles.wikino_header}>Wikipedia</h3>
            <p>
              Здесь вы не найдете Wiki или нечто на нее похожее.{" "}
              <a href={genCMSPath(CMSPath.WikipediaDictatorship)}>
                Wikipedia создавалась как инструмент тоталитарного ментального
                диктата
              </a> с иллюзией плюрализма. Ни одна Wiki не хочет сомнений и критики
              пропагандируемых в ней идей. Потому что это задевает интересы
              хозяев конкретного Wiki-ресурса.
            </p>
            <p>
              В отличии от администраторов Wiki, мы создали свой ресурс
              совершенно для других целей. Мы хотим получить знание для решения
              конкретных насущных проблем. Мы понимаем, что этого знания сейчас
              у нас нет. И что только совместная работа над ним единомышленников
              позволит это знание обрести. <a href={genCMSPath(CMSPath.BasicInstructions)}>
              За работу, товарищи!</a>
            </p>
          </article>
        </section>
      }
    </main>
  );
};

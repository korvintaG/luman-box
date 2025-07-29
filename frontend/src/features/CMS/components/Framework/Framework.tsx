import React from 'react';
import styles from "../CMS.module.css";
import framework from "../../../../assets/images/framework.png";
import {
  BreadcrumbSimpeType,
  Breadcrumbs,
} from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { CMSPath, genCMSPath } from '../../CMSTypes';

export const FrameworkCMS=  React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Framework «Sferatum»</title>
      </Helmet>
      <div className={styles.main}>
        <Breadcrumbs breadcrumbElementTypes={[BreadcrumbSimpeType.CMSAbout]} />
        <section>
          <figure>
            <picture>
              <img
                src={framework}
                alt="Framework «Sferatum»"
              />
            </picture>
            <figcaption>Framework «Sferatum»</figcaption>
          </figure>
          <div>
            <h1>Framework «Sferatum»</h1>
            <p>
              <strong>Фреймворки для совместной работы</strong> — это наборы инструментов, практик и методологий, которые помогают 
              координировать работу команд в разных сферах, например в IT-сфере или в управлении проектами. 
              Такие фреймворки могут быть предназначены для масштабирования гибких подходов (например,{" "}
              <a href="https://ru.wikipedia.org/wiki/Agile" target="_blank" rel="noopener noreferrer">Agile</a>
              ) или для синхронизации команд. 
            </p>
            <p>
              <strong>Framework Sferatum</strong> - это фреймворк для совместного поиска нового знания. 
              "Новое знание" - это не в смысле еще не существующее знание, а то знание, которое еще не было обнаружено Вами. 
              Но которое жизненное необходимо для Вас <span>здесь и сейчас</span>. Это могут быть как идеи, впервые опубликованные 
            вчера новым модным автором, так и идеи, сформулированные более 2000 лет тому назад еще древними греками.
            </p>
            <div className={styles.listHeader}>
              Наш фреймворк позволяет:
              <ul>
                <li>
                  Публиковать заинтересовавшие Вас идеи по усовершенствованному{" "}
                  <Link to={genCMSPath(CMSPath.ZettelKasten)}>методу ZettelKasten</Link>.{" "}
                  С привязкой их к конкретному источнику с указанием автора, названия, цитаты и ключевых слов.
                </li>
                <li>
                  Ознакамливаться с идеями, возникшими у других пользователей нашего фреймворка по определенным источникам, авторам, ключевым словам.
                </li>
                <li>
                  Оценивать идеи других пользователей по интегральному 3*5-мерному критерию.
                </li>
                <li>
                  Предлагать другие формулировки для уже существующих идей. Например, упрощая их или, наоборот, усложняя.
                </li>
                <li>
                  Формировать свою коллекцию идей, которые Вы считаете интересными и полезными для Вас.
                </li>
                <li>
                  Формировать свою ленту добавляемых идей по заданным Вами критериям.
                </li>
                <li>
                  Принимать участие в обсуждении идей других посетителей нашего фреймворка. Благодаря использованию в системе правил дискуссии{" "}
                  <Link to={genCMSPath(CMSPath.MortimerAdler)}>
                  Мортимера Адлера
                  </Link>
                  , в обсуждениях гарантированно не будет ругани и дублей. Только конструктивные и полезные обсуждения!
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
});

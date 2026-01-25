import { appRoutesURL, telegramBotURL } from "../../../../app/router/app-routes-URL";
import { SimpleComponentType } from "../../CMSTypes";
import styles from "../CMS.module.css";
import manual from "../../../../assets/images/manual.png";
import {
  BreadcrumbSimpeType,
  Breadcrumbs,
} from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import React, { SyntheticEvent } from "react";

export const BasicInstructionsCMS = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Краткая инструкция Sferatum</title>
      </Helmet>
      <div className={styles.main}>
        <Breadcrumbs breadcrumbElementTypes={[BreadcrumbSimpeType.CMSAbout]} />
        <section>
          <figure>
            <picture>
              <img src={manual} alt="Книга с пользовательскими инструкциями" />
            </picture>
            <figcaption>Краткие инструкции</figcaption>
          </figure>
          <div>
            <h1>Краткая инструкция по работе с системой</h1>
            <p>
              Чтобы начать работать с системой, необходимо:
              <ul>
                <li>
                  Войти в наш <Link to={telegramBotURL}>Telegram-бот</Link> и
                  зарегистрироваться в системе;
                </li>
                <li>
                  По полученным в Telegram-боте логину и паролю{" "}
                  <Link to={appRoutesURL.auth}>войти в систему</Link>;
                </li>
                <li>
                  После успешной авторизации Вы сможете:
                  <ul>
                    <li>
                      Добавлять новых <Link to={appRoutesURL.authors}>авторов</Link>;
                    </li>
                    <li>
                      Добавлять новые <Link to={appRoutesURL.sources}>источники</Link>;
                    </li>
                    <li>
                      Добавлять новые <Link to={appRoutesURL.ideas}>идеи</Link>;
                    </li>
                    <li>
                      Добавлять новые{" "}
                      <Link to={appRoutesURL.keywords}>ключевые слова</Link>;
                    </li>
                    <li>Добавлять новые взаимосвязи идей;</li>
                    <li>Оценивать идеи;</li>
                    <li>Оценивать взаимосвязи идей.</li>
                  </ul>
                </li>
              </ul>
            </p>
          </div>
        </section>
      </div>
    </>
  );
});

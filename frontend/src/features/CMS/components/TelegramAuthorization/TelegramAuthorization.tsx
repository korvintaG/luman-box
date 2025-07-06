import React from 'react';
import { appRoutesURL, telegramBotURL } from "../../../../app/router/AppRoutesURL";
import { SimpleComponentType } from "../../CMSTypes";
import styles from "../CMS.module.css";
import telegram from "../../../../assets/images/Telegram.png";
import {
  BreadcrumbSimpeType,
  Breadcrumbs,
} from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const TelegramAuthorizationCMS = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Регистрация через Telegram</title>
      </Helmet>

      <div className={styles.main}>
        <Breadcrumbs breadcrumbElementTypes={[BreadcrumbSimpeType.CMSAbout]} />
        <section>
          <figure>
            <picture>
              <img
                src={telegram}
                alt="Фирменный логотип мессенджера Telegram"
              />
            </picture>
            <figcaption>Вход через Telegram!</figcaption>
          </figure>

          <div>
            <h1>Зачем нужна регистрация через Telegram?</h1>
            <p>
              Свобода слова это конечно хорошо, но нужна и ответственность.
              Нужно как то идентифицировать конкретного пользователя. Причем
              желательно анонимно, чтобы такая привязка никак не могла навредить
              пользователю ресурса. На наш взгляд наилучший вариант - это
              идентификация через Telegram chat_id. Система знает о посетителе
              только его chat_id, а через Telegram chat_id невозможно узнать №
              телефона. Т.е. с одной стороны у нас есть однозначная
              идентификация пользователя, а с другой стороны конфиденциальности
              наших посетителей ничего не угрожает!
            </p>
            <p>
              Чтобы зарегистрироваться в нашей системе, Вам нужно перейти в наш{" "}
              <Link to={telegramBotURL}>Telegram-бот</Link>, выбрать желаемый логин
              и пароль. И уже с этими логином/паролем{" "}
              <Link to={appRoutesURL.auth}>войти в систему</Link>.
            </p>
          </div>
        </section>
      </div>
    </>
  );
});

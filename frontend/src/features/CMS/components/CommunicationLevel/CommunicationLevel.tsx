import { CMSPath, SimpleComponentType, genCMSPath } from "../../CMSTypes";
import styles from "../CMS.module.css";
import access from "../../../../assets/images/access.jpg";
import {
  BreadcrumbSimpeType,
  Breadcrumbs,
} from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";

export const CommunicationLevelCMS: SimpleComponentType = () => {
  return (
    <>
      <Helmet>
        <title>Управление доступностью в Sferatum</title>
      </Helmet>
      <div className={styles.main}>
        <Breadcrumbs
          breadcrumbElementTypes={[
            BreadcrumbSimpeType.CMSAbout,
            BreadcrumbSimpeType.LikeMindedPeople,
          ]}
        />
        <section>
          <figure>
            <picture>
              <img
                src={access}
                alt="Человек, открывающий информационные входы"
              />
            </picture>
            <figcaption>Надо управлять своей доступностью!</figcaption>
          </figure>
          <div>
            <h1>Уровень доступности в системе</h1>
            <p>
              У нас есть два основных уровня доступности:
              <ul>
                <li>
                  Полностью <span>открытый</span> - позволяет другим
                  пользователям писать Вам сообщения;
                </li>
                <li>
                  Полностью <span>закрытый</span> (по умолчанию) - другие
                  пользователи не смогут Вам слать сообщения, а общаться с Вами
                  смогут лишь косвенно, реагируя добавлением своих идей на Ваши.
                </li>
              </ul>
            </p>
            <p>
              Мы настоятельно рекомендуем закрытую доступность. Мессенджеров
              полно сейчас самых разных. А вот совместно безличностно мыслить
              удобней всего у нас!
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

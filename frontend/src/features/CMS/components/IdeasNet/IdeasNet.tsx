import { CMSPath, SimpleComponentType, genCMSPath } from "../../CMSTypes";
import styles from "../CMS.module.css";
import ideanet from "../../../../assets/images/ideanet.jpg";
import {
  BreadcrumbSimpeType,
  Breadcrumbs,
} from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";

export const IdeasNetCMS: SimpleComponentType = () => {
  return (
    <>
      <Helmet>
        <title>О сети идей Sferatum</title>
      </Helmet>
      <main className={styles.main}>
        <Breadcrumbs breadcrumbElementTypes={[BreadcrumbSimpeType.CMSAbout]} />
        <section>
          <figure>
            <picture>
              <img
                src={ideanet}
                alt="Множество людей, некоторые из которых размышляют над одними и теми мы идеями"
              />
            </picture>
            <figcaption>Сеть идей реально существует!</figcaption>
          </figure>
          <div>
            <h1>Публичная сеть идей - что это?</h1>
            <p>
              Мы, люди, очень редко придумываем новые идеи. Мы просто в какой то
              момент времени <span>открываем для себя идеи</span>, которым может
              быть более 1000 лет. И потом мы как-то встраиваем эти идеи в свою
              картину мира. Наш сайт может Вам помочь в этом непростом процессе
              познания. А именно:
              <ul>
                <li>
                  узнать <span>самые обсуждаемые идеи</span> по интересуемым Вас
                  книгам (источникам) и авторам;
                </li>
                <li>
                  <span>поделиться</span> с сообществом своей идеей, возникшей
                  при прочтении какой-то книги;
                </li>
                <li>
                  <span>оценить</span> обсуждаемые на сайте идеи;
                </li>
                <li>
                  сформировать в удобном виде{" "}
                  <span>список заинтересовавших Вас идей</span>, чтобы
                  презентовать его своим знакомым и в социальных сетях;
                </li>
                <li>
                  изучать списки идей, которые заинтересовали тех или иных
                  пользователей системы, чтобы <span>открывать для себя</span>{" "}
                  новые идеи, книги и авторов;
                </li>
                <li>
                  исследовать, устанавливать и оценивать <span>связи</span>{" "}
                  между заинтересовавшими Вас идеями;
                </li>
                <li>
                  <span>менять</span> на основании новых идей свою картину мира
                  и свою жизнь (пока в проекте).
                </li>
              </ul>
            </p>
            <p>
              Новые идеи заносятся в систему по модифицированному{" "}
              <a href={genCMSPath(CMSPath.ZettelKasten)}>методу ZettelKasten</a>
              .
            </p>
            <p>
              Организация дискуссий произодится по{" "}
              <a href={genCMSPath(CMSPath.MortimerAdler)}>
                принципам, изложенным Мортимером Адлером
              </a>{" "}
              в его книге «Как читать книги. Руководство по чтению великих
              произведений».
            </p>
            <p>
              Чтобы начать работать с системой, ознакомьтесь с{" "}
              <a href={genCMSPath(CMSPath.BasicInstructions)}>
                краткой инструкцией
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

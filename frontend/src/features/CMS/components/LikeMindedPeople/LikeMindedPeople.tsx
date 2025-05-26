import { SimpleComponentType } from "../../CMSTypes";
import styles from "../CMS.module.css";
import likeMindedPeople from "../../../../assets/images/LikeMindedPeople.jpg";
import {
  BreadcrumbSimpeType,
  Breadcrumbs,
} from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";

export const LikeMindedPeopleCMS: SimpleComponentType = () => {
  return (
    <>
      <Helmet>
        <title>Единомышленники в Sferatum</title>
      </Helmet>

      <main className={styles.main}>
        <Breadcrumbs breadcrumbElementTypes={[BreadcrumbSimpeType.CMSAbout]} />
        <section>
          <figure>
            <picture>
              <img
                src={likeMindedPeople}
                alt="Держащиеся за руки в прыжке парашютисты-единомышленники"
              />
            </picture>
            <figcaption>C единомышленниками весело!</figcaption>
          </figure>
          <div>
            <h1>Как находить единомышленников в нашей системе?</h1>
            <p>
              Единомышленники - это те, кто имеет одинаковые с Вами мысли,
              взгляды, убеждения. Наша система идеально подходит для поиска
              таких людей. А именно
              <span></span> :
              <ul>
                <li>
                  Оценивая определенным образом идеи Вы сами автоматически
                  формируете список своих единомышленников;
                </li>
                <li>
                  Вы можете явно подписаться на тех пользователей, чьи идеи Вам
                  понравились;
                </li>
                <li>
                  Вы можете явно подписаться лишь на некоторые идеи
                  пользователей. Например:
                  <ul>
                    <li>
                      Лишь на идеи пользователя по конкретному автору
                      источников;
                    </li>
                    <li>Лишь на идеи пользователя по конкретному источнику;</li>
                    <li>
                      Только на те идеи пользователя, которые помечены заданной
                      группой ключевых слов.
                    </li>
                  </ul>
                </li>
              </ul>
            </p>
            <p>
              Тем самым Вы будете в курсе всех новых идей, которые возникают у
              Ваших единомышленников. При этом Вы сможете исключать не
              интересуемые Вас пласты информации.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

import { SimpleComponentType } from "../../CMSTypes";
import zettel from "../../../../assets/images/zettel.jpg";
import styles from "../CMS.module.css";
import {
  BreadcrumbSimpeType,
  Breadcrumbs,
} from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";

export const ZettelKastenCMS: SimpleComponentType = () => {
  const title = "Метод ZettelKasten организации баз знаний";
  return (
    <>
      <Helmet>
        <title>Метод ZettelKasten</title>
      </Helmet>

      <main className={styles.main}>
        <Breadcrumbs
          breadcrumbElementTypes={[
            BreadcrumbSimpeType.CMSAbout,
            BreadcrumbSimpeType.CMSIdeasNet,
          ]}
        />
        <section>
          <figure>
            <picture>
              <img
                src={zettel}
                alt="Музей ZettelKasten в Билефельдском университете (Германия)"
              />
            </picture>
            <figcaption>
              Музей ZettelKasten в Билефельдском университете (Германия)
            </figcaption>
          </figure>
          <div>
            <h1>{title}</h1>
            <p>
              Классический метод <span>ZettelKasten</span> позволяет ведение
              обычных заметок превратить в формирования полноценной{" "}
              <span>базы знаний</span>. Для этого предлагается следовать
              определенному алгоритму:
              <ul>
                <li>Привязка каждой заинтересовавшей идеи к источнику;</li>
                <li>
                  Четкая формулировка идеи в формате "сообщение самому себе";
                </li>
                <li>Атомарность отдельных заметок/идей;</li>
                <li>
                  Пометка каждой отдельной заметки/идеи одним или несколькими
                  ключевыми словами;
                </li>
                <li>
                  Связывание добавленных идей друг с другом с помощью
                  разнотипных связей
                </li>
              </ul>
            </p>
            <p>
              Мы несколько доработали классический ZettelKasten следующими
              принципами:
              <ul>
                <li>
                  Обязательное сопровождение каждой атомарной идеи конкретной
                  цитатой из источника;
                </li>
                <li>
                  Организация ключевых слов в виде многоуровневых иерархических
                  списков;
                </li>
                <li>
                  Возможность анализа идей как в виде единого списка, так и в
                  виде иерархической структуры;
                </li>
                <li>
                  Использование синонимов и антонимов для упорядочивания базы.
                </li>
              </ul>
              Подробней о нашей доработке классического ZettelKasten можно
              почитать на{" "}
              <a href="https://habr.com/ru/companies/lumanbox/articles/740546/">
                Habr.com
              </a>
              .
            </p>
            <p>
              Изначально ZettelKasten задумывался исключительно для
              индивидуальных баз знания. Проблема его использования для
              публичных баз заключалась, прежде всего, в отличии сознаний
              отдельных индивидуумов. У каждого человека свой набор ключевых
              слов, свой тезаурус формулировки идей. Однако в менеджменте Agile
              уже есть способ решения рассогласованности мышления отдельных
              исполнителей проекта - это SCRUM-мастер. По аналогии с Agile в
              Sferatum вводится понятие <span>архивариуса базы знаний</span>.
              Каждая добавляемая идея или ключевое слово проходит через его
              контроль. Тем самым обеспечивается унификация знаний.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

import { FC } from "react";
import { Link } from "react-router-dom";
import { appRoutesURL } from "../../../../../app/router/AppRoutesURL";

import styles from "./SourceKeywords.module.css";
import { SimpleNameObjectWithCnt } from "../../../../../shared/common-types";

export type SourceKeywordsProps = {
  title: string;
  source_id: number;
  keywordsAll: SimpleNameObjectWithCnt[] | undefined; // ключевые слова для выбора
};

export const SourceKeywords: FC<SourceKeywordsProps> = (props) => {
  if (!props.keywordsAll || props.keywordsAll.length === 0) return null;
  return (
    <details>
      <summary className={styles.header}>{props.title} </summary>
      <section className={styles.block}>
        <p className={styles.sub_block}>
          {props.keywordsAll.map((el) => {
            if (el.cnt === 1)
              return (
                <Link
                  key={el.id}
                  className={styles.element}
                  to={
                    appRoutesURL.ideaFind +
                    "?source_id=" +
                    props.source_id +
                    "&keyword_id=" +
                    el.id
                  }
                >
                  {"#" + el.name}
                </Link>
              );
            else
              return (
                <Link
                  key={el.id}
                  className={styles.element}
                  to={
                    appRoutesURL.ideas +
                    "?source_id=" +
                    props.source_id +
                    "&keyword_id=" +
                    el.id
                  }
                >
                  {"#" + el.name}
                </Link>
              );
          })}
        </p>
      </section>
    </details>
  );
};

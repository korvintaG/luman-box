import { FC } from "react";
import { SimpleNameObject } from "../../types/entity-types";
import { Link } from "react-router-dom";
import styles from "./RelationList.module.css";
import clsx from "clsx";

export type RelationListProps = {
  title: string;
  list: SimpleNameObject[] | undefined;
  genEntityURL: (id: number) => string;
  prefix?: string;
};

export const RelationList: FC<RelationListProps> = ({
  list,
  title,
  genEntityURL,
  prefix,
}) => {
  if (!list || list.length === 0) return null;
  const clonedArray = list.map((a) => {
    return { ...a };
  });
  clonedArray.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <details>
      <summary className={styles.header}>{title}</summary>
      <section
        className={clsx(styles.block, {
          [styles.horizontal]: prefix,
          [styles.vertical]: !prefix
        })}
      >
        <ul>
          {clonedArray.map((el) => {
            return (
              <li key={el.id} className={styles.element}>
                <Link to={genEntityURL(el.id)}>
                  {(prefix ? prefix : "") + el.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </details>
  );
};

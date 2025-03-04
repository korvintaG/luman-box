import { FC } from "react";
import { SimpleNameObject } from "../../../../utils/type";
import { Link } from "react-router-dom";
import { getRouteParam } from "../../../../AppRoutes";
import styles from "./relation-list.module.css";

export type RelationListUIProps = {
  title: string;
  list: SimpleNameObject[] | undefined;
  editURLPath: string;
};

export const RelationListUI: FC<RelationListUIProps> = ({
  list,
  title,
  editURLPath,
}) => {
  if (!list || list.length === 0) return null;
  const clonedArray = list.map((a) => {
    return { ...a };
  });
  clonedArray.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <details>
      <summary className={styles.header}>{title}</summary>
      <section className={styles.block}>
        <ul>
          {clonedArray.map((el) => {
            return (
              <li key={el.id} className={styles.element}>
                <Link to={getRouteParam(editURLPath, el.id)}>{el.name}</Link>
              </li>
            );
          })}
        </ul>
      </section>
    </details>
  );
};

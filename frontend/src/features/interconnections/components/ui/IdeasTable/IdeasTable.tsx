import { FC } from "react";
import { InterconnectionIdeas } from "../../../InterconnectionTypes";
import clsx from "clsx";
import styles from "./IdeasTable.module.css";
import { Link } from "react-router-dom";
import {
  genIdeaURL,
  genInterconnectionURL,
  genSourceURL,
} from "../../../../../app/router/navigation";
import SvgIcon from "../../../../../shared/components/SvgIcon/SvgIcon";

type IdeasTableProps = {
  sectionClass: string;
  title: string;
  ideas: InterconnectionIdeas[];
  isReverse: boolean;
};

export const IdeasTable: FC<IdeasTableProps> = (props: IdeasTableProps) => {
  return (
    <table className={clsx(styles.table, props.sectionClass)}>
      <caption className={styles.tableCaption}>{props.title}</caption>
      <thead>
        <tr>
          <th>Суть связи</th>
          <th>Название идеи</th>
          <th>Источник идеи</th>
        </tr>
      </thead>
      <tbody>
        {props.ideas.map((el) => (
          <tr key={el.interconnection_id}>
            <td>
              <Link
                to={genInterconnectionURL(
                  el.interconnection_id,
                  props.isReverse
                )}
              >
                {el.interconnection_name}
              </Link>
            </td>
            <td>
              <Link to={genIdeaURL(el.idea_id)} className={styles.idea}>
                {el.SVG && el.SVG.length > 0 && (
                  <SvgIcon svgString={el.SVG} className={styles.idea_icon} />
                )}
                {el.name}
              </Link>
            </td>
            <td>
              <Link to={genSourceURL(el.source_id)}> {el.source_name}</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

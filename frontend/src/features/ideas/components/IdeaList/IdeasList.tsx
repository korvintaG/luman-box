import { FC } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Idea } from "../../IdeaTypes";
import { RecordsList } from "../../../../shared/components/RecordsList";
import { getRouteParam, appRoutes } from "../../../../app/router/AppRoutes";
import { parseISO, format } from "date-fns";
import styles from "./IdeasList.module.css";
import { sourceFullNameFromObj } from "../../../../shared/utils/utils";
import { RequestStatus } from "../../../../shared/common-types";
import { useIdeasList } from "../../hooks/UseIdeasList";
import { genIdeaURL, genSourceURL } from "../../../../app/router/navigation";

export type IdeasListProps = {
  readOnly: boolean;
  gotoIdeaAdd: ()=>void;
  condSrc?:string | null;
  condKw?:string | null;
};

export const IdeasList: FC<IdeasListProps> = ({
  readOnly,
  gotoIdeaAdd,
  condSrc,
  condKw  
}) => {
  const {ideas, sliceState, addNewIdea, fetchRecords, error } = useIdeasList({gotoIdeaAdd,condSrc,condKw});

  return (
    <RecordsList
      skipUl
      header="Список идей"
      captionAddButton="Добавить идею"
      readOnly={readOnly}
      addRecord={addNewIdea}
      sliceState={sliceState}
      error={error}
    >
      <table className={styles.list}>
        <thead>
          <tr>
            <th>Название идеи</th>
            <th>Источник</th>
            <th>Пользователь</th>
            <th>Добавлено</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map((idea) => {
            return (
              <tr key={idea.id}>
                <td>
                  <Link
                    className={clsx({ "moderated-need": !idea.moderated })}
                    to={genIdeaURL(idea.id)}
                  >
                    {idea.name}
                  </Link>
                </td>
                <td>
                  {idea.source && (
                    <Link to={genSourceURL(idea.source.id)}>
                      {sourceFullNameFromObj(idea.source)}
                    </Link>
                  )}
                </td>
                <td>{idea.user ? idea.user.name : ""}</td>
                <td className={styles.date_time}>
                  {idea.date_time_create
                    ? format(parseISO(idea.date_time_create), "dd.MM.yy HH:mm")
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </RecordsList>
  );
};

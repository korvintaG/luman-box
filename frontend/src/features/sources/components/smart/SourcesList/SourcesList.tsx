import { FC } from "react";
import clsx from "clsx";
import { Source } from "../../../SourceTypes";
import { RecordsList } from "../../../../../shared/components/RecordsList";
import { Link } from "react-router-dom";
import { getRouteParam, appRoutes } from "../../../../../app/router/AppRoutes";
import styles from "./SourcesList.module.css";
import { sourceFullNameFromObj } from "../../../../../shared/utils/utils";
import { RequestStatus } from "../../../../../shared/common-types";
import { useSourcesList } from "../../../hooks/UseSourcesList";

export type SourcesListProps = {
  readOnly?: boolean;
  gotoSourceAdd: ()=>void;
};

export const SourcesList: FC<SourcesListProps> = ({
  readOnly,
  gotoSourceAdd
}) => {
  const {sources, sliceState, error, addNewSource, fetchRecords} = useSourcesList(gotoSourceAdd);

  return (
    <RecordsList
      header="Список источников"
      captionAddButton="Добавить источник"
      readOnly={readOnly}
      addRecord={addNewSource}
      liMobileAlteration
      sliceState={sliceState}
      error={error}
      fetchRecords={fetchRecords}
    >
      {sources.map((source) => (
        <li key={source.id} className={styles.source_li}>
          <Link
            className={clsx(styles.link, {
              "moderated-need": !source.moderated,
            })}
            to={getRouteParam(appRoutes.source, source.id)}
          >
            {sourceFullNameFromObj(source)}
          </Link>
        </li>
      ))}
    </RecordsList>
  );
};

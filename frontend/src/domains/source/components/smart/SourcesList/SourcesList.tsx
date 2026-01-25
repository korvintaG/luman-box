import { FC } from "react";
import clsx from "clsx";
import { RecordsList } from "../../../../../shared/components/RecordsList";
import { Link } from "react-router-dom";
import { getRouteParam, appRoutesURL } from "../../../../../app/router/app-routes-URL";
import styles from "./SourcesList.module.css";
import { sourceFullNameFromObj } from "../../../../../shared/utils/utils";
import { useSourcesList } from "../../../hooks/UseSourcesList";
import { getVerificationClass } from "../../../../../shared/CSS/CSS-utils";

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
      {sources.map((source, cnt) => (
        <li key={`source_list_${source.id}`} className={styles.source_li}>
          <Link
            key={`source_link_${source.id}`}
            className={getVerificationClass(source.verification_status)}
            data-cy={`source_link_${cnt}`}
            to={getRouteParam(appRoutesURL.source, source.id)}
          >
            {sourceFullNameFromObj(source)}
          </Link>
        </li>
      ))}
    </RecordsList>
  );
};

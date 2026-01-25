import { FC, SyntheticEvent } from "react";
import styles from "./Keyword.module.css";
import { Link } from "react-router-dom";
import { getRouteParam, appRoutesURL } from "../../../../../app/router/app-routes-URL";

export type KeywordProps = {
  id: number;
  name: string;
  deleteKeyword: (e: SyntheticEvent, id: number) => void;
  readOnly?: boolean;
  dataCy?: string;
  tooltipId?:string;
  tooltipContent?:string;

};

export const Keyword: FC<KeywordProps> = ({
  id,
  name,
  readOnly,
  deleteKeyword,
  dataCy,
  tooltipId,
  tooltipContent
}) => {
  const toolTip=tooltipId && tooltipContent ? {
    "data-tooltip-id": tooltipId,
    "data-tooltip-content": tooltipContent,
  } : {};
  return (
    <div className={styles.keyword} data-cy={dataCy?dataCy:undefined}>
      <Link 
        to={getRouteParam(appRoutesURL.keyword, id)}
        {...toolTip}
      >{"#" + name}</Link>
      {!readOnly && (
        <button
          className={styles.btnClose}
          disabled={readOnly}
          onClick={(e: SyntheticEvent) => deleteKeyword(e, id)}
        >
          x
        </button>
      )}
    </div>
  );
};

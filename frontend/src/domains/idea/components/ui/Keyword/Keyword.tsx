import { FC, SyntheticEvent } from "react";
import styles from "./Keyword.module.css";
import { Link } from "react-router-dom";
import { getRouteParam, appRoutesURL } from "../../../../../app/router/AppRoutesURL";

export type KeywordProps = {
  id: number;
  name: string;
  deleteKeyword: (e: SyntheticEvent, id: number) => void;
  readOnly?: boolean;
  dataCy?: string;
};

export const Keyword: FC<KeywordProps> = ({
  id,
  name,
  readOnly,
  deleteKeyword,
  dataCy,
}) => {
  return (
    <div className={styles.keyword} data-cy={dataCy?dataCy:undefined}>
      <Link to={getRouteParam(appRoutesURL.keyword, id)}>{"#" + name}</Link>
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

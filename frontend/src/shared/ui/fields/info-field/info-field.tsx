import { FC } from "react";
import { combineClasses } from "../../../utils/utils";

import styles from "./info-field.module.css";
import clsx from "clsx";

export type InfoFieldType = "info" | "error" | "success" | "processing";

export type InfoFieldUIProps = {
  label: string;
  text: string;
  dataCy?: string;
  type?: InfoFieldType;
};

export const InfoFieldUI: FC<InfoFieldUIProps> = ({label, text, type="info", dataCy}) => {
    return (<>
      <div className={styles.mobile}>
        <label 
          className={clsx(styles.label, styles[type])} 
          data-cy={dataCy?`${dataCy}-label`:undefined}>
            {label}
        </label>
        <p 
          className={clsx(styles.field, styles[type])} 
          data-cy={dataCy?`${dataCy}-field`:undefined}>
            {text}
        </p>
      </div>
      <label 
        className={clsx(styles.label, styles.tabletAndDesktop, styles[type])} 
        data-cy={dataCy?`${dataCy}-label`:undefined}
      >
        {label}
      </label>
      <p 
        className={clsx(styles.field, styles.tabletAndDesktop, styles[type])} 
        data-cy={dataCy?`${dataCy}-field`:undefined}
      >
        {text}
      </p>
    </>
    );
};

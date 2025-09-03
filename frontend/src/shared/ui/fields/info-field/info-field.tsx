import { FC } from "react";
import { combineClasses } from "../../../utils/utils";

import styles from "./info-field.module.css";
import clsx from "clsx";

export type InfoFieldType = "info" | "error" | "success" | "processing";

export type InfoFieldUIProps = {
  label: string;
  text: string;
  type?: InfoFieldType;
};

export const InfoFieldUI: FC<InfoFieldUIProps> = ({label, text, type="info"}) => {
    return (<>
      <div className={styles.mobile}>
        <label className={clsx(styles.label, styles[type])}>{label}</label>
        <p className={clsx(styles.field, styles[type])}>{text}</p>
      </div>
      <label className={clsx(styles.label, styles.tabletAndDesktop, styles[type])}>{label}</label>
      <p className={clsx(styles.field, styles.tabletAndDesktop, styles[type])}>{text}</p>
    </>
    );
};

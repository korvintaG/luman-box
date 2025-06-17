import { FC } from "react";
import { combineClasses } from "../../../utils/utils";

import styles from "./info-field.module.css";

export type InfoFieldUIProps = {
  label: string;
  text: string;
  classReplace?: string;
  classAdd?: string;
  labelClassReplace?: string;
  labelClassAdd?: string;
  textClassAdd?: string;
  textClassReplace?: string;
};

export const InfoFieldUI: FC<InfoFieldUIProps> = (props) => {
  const blockClass = combineClasses(
    styles["block"],
    props.classReplace,
    props.classAdd
  );
  const labelClass = combineClasses(
    styles["label"],
    props.labelClassReplace,
    props.labelClassAdd
  );
  const infoClass = combineClasses(
    styles["field"],
    props.textClassReplace,
    props.textClassAdd
  );
  if (window.innerWidth <= 765)
    return (
      <div className={blockClass}>
        <label className={labelClass}>{props.label}</label>
        <p className={infoClass}>{props.text}</p>
      </div>
    );
  else
    return (
      <>
        <label className={labelClass}>{props.label}</label>
        <p className={infoClass}>{props.text}</p>
      </>
    );
};

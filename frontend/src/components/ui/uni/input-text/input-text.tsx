import { FC, ChangeEvent } from "react";
import { combineClasses } from "../../../../utils/utils";
import { HTMLEditElement } from "../../../../utils/type";
import styles from "./input-text.module.css";

export type InputTextUIProps = {
  label: string;
  name: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
  rows?: number;
  classReplace?: string;
  classAdd?: string;
  labelClassReplace?: string;
  labelClassAdd?: string;
  textClassReplace?: string;
  textClassAdd?: string;
  readOnly?: boolean;
};

export const InputTextUI: FC<InputTextUIProps> = (props) => {
  return (
    <div
      className={combineClasses(
        styles.block,
        props.classReplace,
        props.classAdd,
      )}
    >
      <h6
        className={combineClasses(
          styles.header,
          props.labelClassReplace,
          props.labelClassAdd,
        )}
      >
        {props.label}
      </h6>
      <textarea
        readOnly={props.readOnly}
        className={combineClasses(
          styles.text,
          props.textClassReplace,
          props.textClassAdd,
        )}
        rows={props.rows ? props.rows : 15}
        value={props.value}
        name={props.name}
        onChange={props.handleChange}
      />
    </div>
  );
};

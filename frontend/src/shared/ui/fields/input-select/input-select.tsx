import { FC, ChangeEvent } from "react";
import { combineClasses } from "../../../utils/utils";
import { HTMLEditElement } from "../../../common-types";
import styles from "./input-select.module.css";

export type SelectedValues = {
  id: number;
  name: string;
};

export type InputSelectUIProps = {
  label: string;
  name: string;
  value: number;
  values: SelectedValues[];
  handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
  placeholder?: string;
  classReplace?: string;
  classAdd?: string;
  labelClassReplace?: string;
  labelClassAdd?: string;
  selectClassReplace?: string;
  selectClassAdd?: string;
  hideEmpty?: boolean;
  readOnly?: boolean;
};

export const InputSelectUI: FC<InputSelectUIProps> = (props) => {
  const getSelectName = (): string => {
    const found = props.values.find((el) => el.id === props.value);
    if (found) return found.name;
    else return "";
  };

  return (
    <div
      className={combineClasses(
        styles["input-block"],
        props.classReplace,
        props.classAdd,
      )}
    >
      <label
        htmlFor={props.name}
        className={combineClasses(
          styles["input-label"],
          props.labelClassReplace,
          props.labelClassAdd,
        )}
      >
        {props.label}
      </label>
      {props.readOnly ? (
        <span className={styles["input-select-readonly"]}>
          {getSelectName()}
        </span>
      ) : (
        <select
          value={props.value}
          name={props.name}
          disabled={props.readOnly}
          onChange={props.handleChange}
          className={combineClasses(
            styles["input-select"],
            props.selectClassReplace,
            props.selectClassAdd,
          )}
        >
          {props.hideEmpty ? null : <option value="0"></option>}
          {props.values.map((el) => (
            <option className={styles.option} value={el.id} key={el.id}>
              {el.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

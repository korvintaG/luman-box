import React, { FC, useCallback, useId } from "react";
import { combineClasses } from "../../../utils/utils";
import styles from "./input-select.module.css";
import { CustomInput } from "../../UITypes";
import { Link } from "react-router-dom";

export type SelectedValues = {
  id: number;
  name: string;
};

export type InputSelectUIProps = React.ComponentPropsWithoutRef<"select"> &
  CustomInput & {
    values: SelectedValues[];
    hideEmpty?: boolean;
    readOnly?: boolean;
    URL?: string;
    valueText?:string;
  };

type ValueReadOnlyProps = {
  URL?: string;
  id?: string;
  className?: string;
  text?: string;
};

const ValueReadOnly: FC<ValueReadOnlyProps> = (props) => {
  //console.log('ValueReadOnly',props)
  if (props.URL)
    return (
      <Link id={props.id} to={props.URL} className={props.className}>
        {props.text}
      </Link>
    );
  else
    return (
      <p id={props.id} className={props.className}>
        {props.text}
      </p>
    );
};

export const InputSelectUI: FC<InputSelectUIProps> = ({
  label,
  classes,
  values,
  valueText,
  hideEmpty,
  readOnly,
  URL,
  ...selectProps
}) => {
  const inputId = useId();

  const getSelectName = (): string => {
    const found = values.find((el) => el.id === selectProps.value);
    if (found) return found.name;
    else return "";
  };

  const classLabel = combineClasses(
    styles.label,
    classes?.classLabelReplace,
    classes?.classLabelAdd
  );
  const classEdit = combineClasses(
    styles.field,
    classes?.classInputReplace,
    classes?.classInputAdd
  );
  const classEditReadonly = combineClasses(
    styles.field_readonly,
    classes?.classInputReplace,
    classes?.classInputAdd
  );

  /*const ReadOnlyComp = () =>
    URL ? (
      <Link id={inputId} to={URL} className={classEditReadonly}>
        {getSelectName()}
      </Link>
    ) : (
      <p id={inputId} className={classEditReadonly}>
        {getSelectName()}
      </p>
    );*/

  return (
    <>
      <label htmlFor={inputId} className={classLabel}>
        {label}
      </label>
      {readOnly ? (
        <ValueReadOnly
          URL={URL}
          text={valueText}
          id={inputId}
          className={classEditReadonly}
        />
      ) : (
        <select
          id={inputId}
          value={selectProps.value}
          name={selectProps.name}
          onChange={selectProps.onChange}
          className={classEdit}
        >
          {hideEmpty ? null : <option value="0"></option>}
          {values.map((el) => (
            <option className={styles.option} value={el.id} key={el.id}>
              {el.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

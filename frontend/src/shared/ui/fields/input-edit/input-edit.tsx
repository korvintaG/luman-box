import { FC, useId } from "react";
import { combineClasses } from "../../../utils/utils";
import styles from "./input-edit.module.css";
import { CustomInput } from "../../UITypes";

export type InputEditUIProps = React.ComponentPropsWithoutRef<"input"> & CustomInput;

export const InputEditUI: FC<InputEditUIProps> = ({
  label,
  classes,
  ...inputProps
}) => {
  const inputId = useId();
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

  return (
    <>
      {label !== "" && (
        <label htmlFor={inputId} className={classLabel}>
          {label}
        </label>
      )}

      {inputProps.readOnly ? (
        <p id={inputId} className={classEditReadonly}>
          {inputProps.value}
        </p>
      ) : (
        <input
          id={inputId}
          className={classEdit}
          {...inputProps}
          value={inputProps.value !== null ? inputProps.value : ""}
        ></input>
      )}
    </>
  );
};

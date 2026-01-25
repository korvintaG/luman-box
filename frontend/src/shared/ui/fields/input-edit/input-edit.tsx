import { FC, useId } from "react";
import { combineClasses } from "../../../utils/utils";
import styles from "./input-edit.module.css";
import { CustomInput } from "../../../types/ui-types";
import clsx from "clsx";

export enum ReadOnlyDecor {
  ToModerate=1,
  Rejected=2
}

export type InputEditUIProps = React.ComponentPropsWithoutRef<"input"> & CustomInput & {
  dataCy?: string;
  readOnlyDecor?: ReadOnlyDecor;
  errorModerationText?:string;
};

export const InputEditUI: FC<InputEditUIProps> = ({
  label,
  dataCy,
  readOnlyDecor,
  errorModerationText,
  ...inputProps
}) => {
  const inputId = useId();

  return (
    <>
      {label  && (
        <label htmlFor={inputId} className={styles.label} data-cy={dataCy?`${dataCy}-label`:undefined}>
          {label}
        </label>
      )}

      {inputProps.readOnly ? (
        <p 
          id={inputId} 
          className={styles.field_readonly} 
          data-cy={dataCy?`${dataCy}-field-readonly`:undefined}>
          <span className={clsx({
            ['record-to-moderate']:readOnlyDecor===ReadOnlyDecor.ToModerate,
            ['record-canceled']:readOnlyDecor===ReadOnlyDecor.Rejected,
          })}>{inputProps.value}</span>
          {errorModerationText && <span className={styles.error_moderation_text}>{` (${errorModerationText})`}</span>}
        </p>
      ) : (
        <input
          id={inputId}
          className={styles.input}
          data-cy={dataCy?`${dataCy}-input`:undefined}
          {...inputProps}
          value={inputProps.value !== null ? inputProps.value : ""}
        ></input>
      )}
    </>
  );
};

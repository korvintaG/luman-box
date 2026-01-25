import React, { FC, useId } from "react";
import { combineClasses } from "../../../utils/utils";
import styles from "./input-text.module.css";
import { CustomInput, LabelPosition } from "../../../types/ui-types";
import { InputTextUIProps } from "./types";


export const InputTextUI: FC<InputTextUIProps> = ({
  label,
  labelPosition,
  dataCy,
  ...textareaProps
}) => {
  const inputId = useId();
  const rows = textareaProps.rows ? textareaProps.rows : 13;

  let curLabelPosition =
    labelPosition !== undefined ? labelPosition : LabelPosition.groupHeader;

  if (curLabelPosition === LabelPosition.groupHeader) { // если заголовок, то класс группового блока
    return <div className={styles.group_block}>
      <label 
        htmlFor={inputId} 
        data-cy={dataCy?`${dataCy}-label`:undefined}
        className={styles.group_label}
      >
        {label}
      </label>
      {textareaProps.readOnly ? (
        <p id={inputId} className={styles.group_text_readonly}
          data-cy={dataCy?`${dataCy}-input-readonly`:undefined}
        >
          {textareaProps.value}
        </p>
      ) : (
        <textarea
          id={inputId}
          data-cy={dataCy?`${dataCy}-input`:undefined}
          className={styles.group_text}
          {...textareaProps}
          rows={rows}
        />
      )}
    </div> 
  }
  
  else { // если label слева, то безымянный блок, которым управляет пользователь
    return <>
      <label 
        htmlFor={inputId} 
        data-cy={dataCy?`${dataCy}-label`:undefined}
        className={styles.left_label}
      >
        {label}
      </label>
      {textareaProps.readOnly ? (
        <p id={inputId} className={styles.left_text_readonly}
          data-cy={dataCy?`${dataCy}-input-readonly`:undefined}
        >
          {textareaProps.value}
        </p>
      ) : (
        <textarea
          id={inputId}
          data-cy={dataCy?`${dataCy}-input`:undefined}
          className={styles.left_text}
          {...textareaProps}
          rows={rows}
        />
      )}
    </>
  }
};

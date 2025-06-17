import React, { FC, useId } from "react";
import { combineClasses } from "../../../utils/utils";
import styles from "./input-text.module.css";
import { CustomInput } from "../../UITypes";

export enum LabelPosition {
  left = 0,
  groupHeader = 1,
}

type ElementClasses = {
  block: string;
  label: string;
  label_readonly: string;
  memo: string;
  memo_readonly: string;
};

export type InputTextUIProps = React.ComponentPropsWithoutRef<"textarea"> &
  CustomInput & {
    labelPosition?: LabelPosition;
  };

export const InputTextUI: FC<InputTextUIProps> = ({
  label,
  labelPosition,
  classes,
  ...textareaProps
}) => {
  const inputId = useId();
  const rows = textareaProps.rows ? textareaProps.rows : 13;

  const elementClassesArray: ElementClasses[] = [
    {
      block: '',
      label: styles.left_label,
      label_readonly: styles.left_label,
      memo: styles.left_text,
      memo_readonly: styles.left_text_readonly,
    },
    {
      block: styles.group_block,
      label: styles.group_label,
      label_readonly: styles.group_label_readonly,
      memo: styles.group_text,
      memo_readonly: styles.group_text_readonly,
    },
  ];
  let curLabelPosition =
    labelPosition !== undefined ? labelPosition : LabelPosition.groupHeader;

  const classLabel = combineClasses(
    textareaProps.readOnly
      ? elementClassesArray[curLabelPosition].label_readonly
      : elementClassesArray[curLabelPosition].label,
    classes?.classLabelReplace,
    classes?.classLabelAdd
  );
  const classBlock = combineClasses(
    elementClassesArray[curLabelPosition].block,
    classes?.classReplace,
    classes?.classAdd
  );

  const classText = combineClasses(
    elementClassesArray[curLabelPosition].memo,
    classes?.classInputReplace,
    classes?.classInputAdd
  );
  const classTextReadOnly = combineClasses(
    elementClassesArray[curLabelPosition].memo_readonly,
    classes?.classInputReplace,
    classes?.classInputAdd
  );
  
  const isDiv = curLabelPosition === LabelPosition.groupHeader;
  const Wrapper = isDiv ? "div" : React.Fragment;
  return (
    <Wrapper {...(isDiv ? { className: classBlock } : {})}>
      <label htmlFor={inputId} className={classLabel}>
        {label}
      </label>
      {textareaProps.readOnly ? (
        <p id={inputId} className={classTextReadOnly}>
          {textareaProps.value}
        </p>
      ) : (
        <textarea
          id={inputId}
          className={classText}
          {...textareaProps}
          rows={rows}
        />
      )}
    </Wrapper>
  );
};

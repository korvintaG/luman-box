import { FC, useId } from "react";
import { combineClasses } from "../../../utils/utils";
import styles from "./link-field.module.css";
import { Link, LinkProps } from "react-router-dom";
import { CustomInput } from "../../UITypes";

export type LinkFieldUIProps = LinkProps & CustomInput;

export const LinkFieldUI: FC<LinkFieldUIProps> = ({
  label,
  classes,
  ...linkProps
}) => {
  const inputId = useId();
  const labelClass = combineClasses(
    styles.label,
    classes?.classLabelReplace,
    classes?.classLabelAdd
  );
  const inputClass = combineClasses(
    styles.field,
    classes?.classInputReplace,
    classes?.classInputAdd
  );
  const inputEmptyClass = combineClasses(
    '',
    classes?.classInputReplace,
    classes?.classInputAdd
  );  
  return (
    <>
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>
      {linkProps.to === "" ? (
        <div className={inputEmptyClass}></div>
      ) : (
        <Link id={inputId} className={inputClass} to={linkProps.to}>
          {linkProps.children}
        </Link>
      )}
    </>
  );
};

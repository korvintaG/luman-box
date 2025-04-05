import { FC } from "react";
import { combineClasses } from "../../../../utils/utils";
import styles from "./link-field.module.css";
import { Link } from "react-router-dom";

export type LinkFieldUIProps = {
  label: string;
  URL: string;
  URLText: string;
  classReplace?: string;
  classAdd?: string;
  labelClassReplace?: string;
  labelClassAdd?: string;
  inputClassReplace?: string;
  inputClassAdd?: string;
};

export const LinkFieldUI: FC<LinkFieldUIProps> = (props) => {
  return (
    <div
      className={combineClasses(
        styles["input-block"],
        props.classReplace,
        props.classAdd,
      )}
    >
      <label
        htmlFor={props.label}
        className={combineClasses(
          styles["input-label"],
          props.labelClassReplace,
          props.labelClassAdd,
        )}
      >
        {props.label}
      </label>
       <Link
          className={combineClasses(
            styles["input-edit"],
            props.inputClassReplace,
            props.inputClassAdd,
          )}
          to={props.URL}
        >
            {props.URLText}
        </Link>
    </div>
  );
};

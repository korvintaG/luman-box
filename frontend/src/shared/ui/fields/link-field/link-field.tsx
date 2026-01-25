import { FC, useId } from "react";
import { combineClasses } from "../../../utils/utils";
import styles from "./link-field.module.css";
import { Link, LinkProps } from "react-router-dom";
import { CustomInput } from "../../../types/ui-types";

export type LinkFieldUIProps = LinkProps & CustomInput;

export const LinkFieldUI: FC<LinkFieldUIProps> = ({
  label,
  ...linkProps
}) => {
  const inputId = useId();
  return (
    <>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      {linkProps.to === "" ? (
        <div className={styles.empty}></div>
      ) : (
        <Link id={inputId} className={styles.input} to={linkProps.to}>
          {linkProps.children}
        </Link>
      )}
    </>
  );
};

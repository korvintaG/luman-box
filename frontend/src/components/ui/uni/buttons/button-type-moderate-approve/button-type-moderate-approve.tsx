import { FC } from "react";
import clsx from "clsx";
import styles from "./button-type-moderate-approve.module.css";

import { ButtonUI, ButtonUIProps } from "../button-type";

export const ButtonModerateApproveUI: FC<ButtonUIProps> = (props) => (
  <ButtonUI
    {...props}
    classAdd={
      props.classAdd ? clsx(props.classAdd, styles.button) : styles.button
    }
  />
);

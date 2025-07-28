import { FC } from "react";
import styles from "./button.module.css";
import clsx from "clsx";

export type LogicButtonType = 'default' | 
  'add' | 'agree' | 'alert' | 'back' | 
  'moderate-approve' | 'moderate-reject';

export type ButtonUIProps = {
  logicType?: LogicButtonType;
  caption?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonUI: FC<ButtonUIProps> = ({
  caption,
  logicType = 'default',
  className,
  type,
  onClick,
  ...props
}) => {
  // Автоматическое определение типа кнопки
  let buttonType = type;
  if (!buttonType) {
    buttonType = onClick ? "button" : "submit";
  }

  const classes = clsx(className, styles.button, styles[`button-${logicType}`]);
  return <button 
    className={classes} 
    type={buttonType}
    onClick={onClick}
    {...props}
  >
    {caption}
  </button>;
};

import { FC, SyntheticEvent } from "react";
import { ButtonUI } from "../buttons/button-type"; 
import styles from "./ErrorMessage.module.css";

export type ErrorMessageUIProps = {
  errorTitle?: string;
  error: string | null;
  okCaption?: string;
  okAction?: (e: SyntheticEvent) => void;
};

export const ErrorMessageUI: FC<ErrorMessageUIProps> = ({
  errorTitle,
  error,
  okCaption,
  okAction,
}) => {
  if (!error || error === "") return null;

  if (!okAction) return <p className={styles.error}>{error}</p>;
  else
    return (
      <section className={styles.error_block}>
        {errorTitle ? (
          <h2 className={styles.title_error}>{errorTitle}</h2>
        ) : null}
        <p className={styles.error}>{error}</p>
        <ButtonUI caption={okCaption ? okCaption : "OK"} action={okAction} />
      </section>
    );
};

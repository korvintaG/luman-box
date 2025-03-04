import { FC, SyntheticEvent } from "react";
import styles from "./record-edit.module.css";

export type RecordEditUIProps = {
  header: string;
  children: React.ReactNode;
  onSubmit: (e: SyntheticEvent) => void;
  formClass?: string;
  mainClass?: string;
};

export const RecordEditUI: FC<RecordEditUIProps> = (
  props: RecordEditUIProps,
) => {
  return (
    <main className={props.mainClass ? props.mainClass : ""}>
      <h1 className={styles["record-header"]}>{props.header}</h1>
      <form
        onSubmit={props.onSubmit}
        className={props.formClass ? props.formClass : styles.form}
      >
        {props.children}
      </form>
    </main>
  );
};

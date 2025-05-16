import { FC, SyntheticEvent } from "react";
import styles from "./RecordEditForm.module.css";
import { RequestStatus } from "../../common-types";
import { Preloader } from "../../ui/Preloader"; 
import { ErrorMessageUI } from "../../ui/ErrorMessage/ErrorMessage";

export type RecordEditFormProps = {
  children: React.ReactNode;
  onSubmit: (e: SyntheticEvent) => void;
  sliceState:RequestStatus[];
  error:string;
  fetchRecord: ()=>void;
  header?: string;
  formClass?: string;
  mainClass?: string;
};

export const RecordEditForm: FC<RecordEditFormProps> = (
  props: RecordEditFormProps,
) => {
  if (props.sliceState && props.sliceState.find(el=>el=== RequestStatus.Loading))
    return <Preloader/>

  if (props.sliceState && props.sliceState.find(el=>el===RequestStatus.Failed))
    return <ErrorMessageUI
      error={props.error?props.error:null}
      okAction={props.fetchRecord}
      errorTitle="Ошибка"
      okCaption="Повторить запрос"
    />

  return (
    <main className={props.mainClass ? props.mainClass : ""}>
      {props.header && <h1 className={styles["record-header"]}>{props.header}</h1>}
      <form
        onSubmit={props.onSubmit}
        className={props.formClass ? props.formClass : styles.form}
      >
        {props.children}
      </form>
    </main>
  );
};

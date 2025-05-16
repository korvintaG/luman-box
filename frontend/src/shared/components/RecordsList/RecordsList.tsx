import { FC } from "react";
import clsx from "clsx";
import { ButtonAddUI } from "../../ui/buttons/button-add"; 
import styles from "./RecordsList.module.css";
import { Preloader } from "../../ui/Preloader";
import { RequestStatus } from "../../common-types";
import { ErrorMessageUI } from "../../ui/ErrorMessage/ErrorMessage";

export type RecordListProps = {
  header: string;
  children: React.ReactNode;
  captionAddButton: string;
  addRecord: () => void;
  fetchRecords?: ()=>void;
  sliceState: RequestStatus;
  error:string;
  skipUl?: boolean; // не писать UL в начале списка
  liMobileAlteration?: boolean; // чередование полос списка в мобильном варианте
  readOnly?: boolean;
};

export const RecordsList: FC<RecordListProps> = (
  props: RecordListProps,
) => {
  if (props.sliceState === RequestStatus.Loading)
    return <Preloader />;

  if (props.sliceState===RequestStatus.Failed)
    return <ErrorMessageUI
      error={props.error?props.error:null}
      okAction={props.fetchRecords}
      errorTitle="Ошибка"
      okCaption="Повторить запрос"
    />

  return (
    <main
      className={clsx(styles.main, "main", {
        [styles["main-shrink"]]: props.liMobileAlteration,
      })}
    >
      <h1 className={styles["page-header"]}>{props.header}</h1>
          {props.skipUl ? (
            props.children
          ) : (
            <ul
              className={clsx(styles.list, {
                [styles["list-mobile-alterarion"]]: props.liMobileAlteration,
              })}
            >
              {props.children}
            </ul>
          )}
          <ButtonAddUI
            action={props.addRecord}
            disabled={props.readOnly}
            caption={props.captionAddButton}
          />
      </main>
  );
};

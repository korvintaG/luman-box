import { FC, SyntheticEvent, useRef } from "react";
import clsx from "clsx";
import { ButtonUI } from "../../ui/button"; 
import styles from "./RecordsList.module.css";
import { Preloader } from "../../ui/Preloader";
import { RequestStatus } from "../../types/types-for-hooks";
import { ErrorMessageUI } from "../../ui/ErrorMessage/ErrorMessage";
import { Breadcrumb, BreadcrumbSimpeType, Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import { useNavigate } from "react-router-dom";

export type RecordListProps = {
  children: React.ReactNode;
  sliceState: RequestStatus;
  error:string;
  fetchRecords: ()=>void;
  captionAddButton?: string;
  header?: string;
  addRecord?: () => void;
  skipUl?: boolean; // не писать UL в начале списка
  liMobileAlteration?: boolean; // чередование полос списка в мобильном варианте
  readOnly?: boolean;
  mainClassName?: string;
  breadcrumbs?: Breadcrumb[];
  showBackButton?:boolean;
};

export const RecordsList: FC<RecordListProps> = (
  props: RecordListProps,
) => {
  const listRef = useRef();
  
  const navigate = useNavigate();
  if (props.sliceState === RequestStatus.Loading)
    return <Preloader />;

  if (props.sliceState===RequestStatus.Failed)
    return <ErrorMessageUI
      error={props.error?props.error:null}
      okAction={props.fetchRecords}
      errorTitle="Ошибка" 
      okCaption="Повторить запрос"
    />

  const back = (e: SyntheticEvent<Element, Event>) => {
    //e.preventDefault();
    navigate(-1);
  };


  return (
    <div 
      className={props.mainClassName ? props.mainClassName
         :clsx(styles.main, "main", {[styles["main-shrink"]]: props.liMobileAlteration})}
      data-cy="records-list"
    >
      {props.breadcrumbs && 
        <Breadcrumbs 
          breadcrumbElementTypes={props.breadcrumbs} 
          header={props.header}
        />
      }
      {props.header && !props.breadcrumbs && <h1 className={styles["page-header"]}>{props.header}</h1>}
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
      {props.addRecord && !props.readOnly && <ButtonUI
        logicType="add"
        onClick={props.addRecord}
        disabled={props.readOnly}
        caption={props.captionAddButton}
        data-cy="add-record-button"
      />}
      {props.showBackButton && <ButtonUI logicType="back" onClick={back} caption="Назад" />}
      </div>
  );
};

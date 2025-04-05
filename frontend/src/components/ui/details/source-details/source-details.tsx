import { FC, ChangeEvent, SyntheticEvent } from "react";
import { HTMLEditElement, SourceRaw, Author } from "../../../../utils/type";
import { RecordEditUI } from "../../uni/record-edit/record-edit";
import { RecordButtonBlockUI } from "../../uni/record-buttons-block/record-buttons-block";
import { ErrorMessageUI } from "../../uni/error-message/error-message";
import { InputEditUI } from "../../uni/input-edit/input-edit";
import { InputSelectUI } from "../../uni/input-select/input-select";
import { RelationListUI } from "../../uni/relation-list";
import { appRoutes, getRouteParam } from "../../../../AppRoutes";
import styles from "./source-details.module.css";
import { genHeaderText, EditAccessStatus } from "../../../../utils/utils";
import { Authorship } from "../../details/authorship/authorship";
import { SourceKeywordsUI } from "../source-keywords/source-keywords";
import { LinkFieldUI } from "../../uni/link-field/link-field";

export type SourceDetailsUIProps = {
  id: number | null;
  editAccessStatus: EditAccessStatus;
  values: SourceRaw; // карточка исходника
  initialName: string; // исходное название источника
  error?: string;
  handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // изменение элемента ввода
  handleSubmit: (e: SyntheticEvent) => void; // действия по submit
  deleteRecord: (e: SyntheticEvent) => void; // действия по удалению источника
  approveRecord: (e: SyntheticEvent) => void; // действия по одобрению источника
  rejectRecord: (e: SyntheticEvent) => void; // действия по отвержению источника
  authors: Author[]; // список авторов для выбора в лукапе
  userName: string;
  moderatorName?: string | null;
};

/**
 * Компонент UI редактирования конкретного источника
 */
export const SourceDetailsUI: FC<SourceDetailsUIProps> = (
  props: SourceDetailsUIProps,
) => {
  const header = genHeaderText(
    props.editAccessStatus === EditAccessStatus.Readonly,
    props.id,
    props.initialName,
    "источника",
  );
  const btnCaptione = props.id ? "Сохранить данные" : "Добавить источник";

  let currentAuthorName='';
  if (props.values.author ) {
    const ca=props.values.author.id;
    const currentAuthor=props.authors.find((el) => el.id === ca);
    if (currentAuthor)
      currentAuthorName=currentAuthor.name;
  }


  return (
    <RecordEditUI
      formClass={styles.form}
      header={header}
      onSubmit={props.handleSubmit}
    >
      <Authorship
        userName={props.userName}
        moderatorName={props.moderatorName}
        className={styles.label_info}
      />
      <InputEditUI
        labelClassAdd={styles.label}
        name="name"
        label="Название источника:"
        value={props.values.name}
        placeholder="Укажите название источника"
        inputClassAdd={styles.input}
        classAdd={styles.input_block}
        readOnly={props.editAccessStatus === EditAccessStatus.Readonly}
        handleChange={props.handleChange}
      />
      {props.editAccessStatus === EditAccessStatus.Readonly ?
        <LinkFieldUI 
          label="Автор:"
          URL={getRouteParam(appRoutes.author, props.values.author!.id)}
          URLText={currentAuthorName}
          classAdd={styles.input_block}
          labelClassAdd={styles.label}
        />
        :
        <InputSelectUI
          labelClassAdd={styles.label}
          name="author.id"
          label="Автор:"
          value={props.values.author ? props.values.author.id : 0}
          readOnly={false}
          selectClassAdd={styles.input}
          classAdd={styles.input_block}
          handleChange={props.handleChange}
          values={props.authors}
        />}
      {props.error && <ErrorMessageUI error={props.error} />}
      <RecordButtonBlockUI
        id={props.id}
        editAccessStatus={props.editAccessStatus}
        deleteRecord={props.deleteRecord}
        approveRecord={props.approveRecord}
        rejectRecord={props.rejectRecord}
        submitButtonCaption={btnCaptione}
        deleteButtonCaption="Удалить источник"
      />
      {props.id && (
        <>
          <RelationListUI
            title="Список идей по источнику:"
            editURLPath={appRoutes.idea}
            list={props.values.ideas}
          />
          <SourceKeywordsUI
            title="Список ключевых слов идей по источнику:"
            source_id={props.id}
            keywordsAll={props.values.keywords}
          />
        </>
      )}
    </RecordEditUI>
  );
};

export function SourceDetailsUIFC(props: SourceDetailsUIProps) {
  return <SourceDetailsUI {...props} />;
}

import { FC, SyntheticEvent, ChangeEvent } from "react";
import { RecordEditUI } from "../../uni/record-edit/record-edit";
import { HTMLEditElement, AuthorRaw } from "../../../../utils/type";
import { appRoutes } from "../../../../AppRoutes";

import { RecordButtonBlockUI } from "../../uni/record-buttons-block/record-buttons-block";
import { InputEditUI } from "../../uni/input-edit/input-edit";
import { genHeaderText, EditAccessStatus } from "../../../../utils/utils";
import { Authorship } from "../../details/authorship/authorship";
import { RelationListUI } from "../../uni/relation-list";
import styles from "./author-details.module.css";

/**
 * Чистый компонент редактирования автора
 */
export type AuthorDetailsUIProps = {
  id: number | null;
  values: AuthorRaw; // поля автора для редактирования
  initialName: string; // начальное имя
  editAccessStatus: EditAccessStatus;
  handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
  handleSubmit: (e: SyntheticEvent) => void; // сохранить изменения в базе
  deleteRecord: (e: SyntheticEvent) => void; // функция удаления автора
  approveRecord: (e: SyntheticEvent) => void; // функция одобрения автора
  rejectRecord: (e: SyntheticEvent) => void; // функция отвержения автора
  userName: string;
  moderatorName?: string | null;
};

export const AuthorDetailsUI: FC<AuthorDetailsUIProps> = (
  props: AuthorDetailsUIProps,
) => {
  const header = genHeaderText(
    props.editAccessStatus === EditAccessStatus.Readonly,
    props.id,
    props.initialName,
    "автора"
  );
  const btnCaptione = props.id ? "Сохранить данные" : "Добавить автора";

  return (
    <RecordEditUI
      formClass={styles.form}
      header={header}
      onSubmit={props.handleSubmit}
    >
      <Authorship
        userName={props.userName}
        moderatorName={props.moderatorName}
        className={styles.label}
      />
      <InputEditUI
        name="name"
        label="ФИО автора:"
        value={props.values.name}
        labelClassAdd={styles.label}
        inputClassAdd={styles.input}
        classAdd={styles.input_block}
        placeholder="Укажите ФИО автора"
        readOnly={props.editAccessStatus === EditAccessStatus.Readonly}
        minLength={5}
        required
        handleChange={props.handleChange}
      />
      <RecordButtonBlockUI
        id={props.id}
        editAccessStatus={props.editAccessStatus}
        deleteRecord={props.deleteRecord}
        approveRecord={props.approveRecord}
        rejectRecord={props.rejectRecord}
        submitButtonCaption={btnCaptione}
        deleteButtonCaption="Удалить автора"
      />
      <RelationListUI
        title="Список источников автора:"
        editURLPath={appRoutes.source}
        list={props.values.sources}
      />
    </RecordEditUI>
  );
};

export function AuthorDetailsUIFC(props: AuthorDetailsUIProps) {
  return <AuthorDetailsUI {...props} />;
}

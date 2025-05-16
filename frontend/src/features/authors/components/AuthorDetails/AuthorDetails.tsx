import { FC } from "react";
import { RecordEditForm } from "../../../../shared/components/RecordEditForm/RecordEditForm"; 
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit"; 
import { genHeaderText, EditAccessStatus, getUserCreator, getModerator, isDMLRequestOK } from "../../../../shared/utils/utils";
import { Authorship } from "../../../../shared/components/Authorship/Authorship";
import { RelationListUI } from "../../../../shared/components/RelationList/RelationList"; 
import styles from "./AuthorDetails.module.css";
import { User } from "../../../auth/user-types";
import { useAuthorDetails } from "../../hooks/UseAuthorDetails";
import { RecordControlBlock } from "../../../../shared/components/RecordControlBlock/RecordControlBlock";
import { genIdeaURL, genKeywordURL, genSourceURL } from "../../../../app/router/navigation";

/**
 * Чистый компонент редактирования автора
 */
export type AuthorDetailsProps = {
  id: string | undefined;
  currentUser: User | null;
  afterSuccessDMLAction: ()=>void;
};

export const AuthorDetails: FC<AuthorDetailsProps> = (
  {id, currentUser, afterSuccessDMLAction}: AuthorDetailsProps,
) => {
  const {form, status, record, moderate  } = useAuthorDetails({id, currentUser});
  const header = genHeaderText(
    status.editAccessStatus === EditAccessStatus.Readonly,
    id?Number(id):null,
    record.currentRecord?.name,
    "автора"
  );

  return (
    <RecordEditForm
      formClass={styles.form}
      header={header}
      onSubmit={record.handleSubmitAction}
      sliceState={status.sliceStates}
      error={status.errorText}
      fetchRecord={record.fetchRecord}
    >
      <Authorship
        userName={getUserCreator(record.currentRecord, currentUser)}
        moderatorName={getModerator(record.currentRecord)}
        className={styles.label}
      />
      <InputEditUI
        name="name"
        label="ФИО автора:"
        value={form.values.name}
        labelClassAdd={styles.label}
        inputClassAdd={styles.input}
        classAdd={styles.input_block}
        placeholder="Укажите ФИО автора"
        readOnly={status.editAccessStatus === EditAccessStatus.Readonly}
        minLength={5}
        required
        handleChange={form.handleChange}
      />
      <RecordControlBlock
        id={id}
        sliceState={status.sliceStates[0]}
        error={status.errorText}
        editAccessStatus={status.editAccessStatus}
        deleteRecord={record.deleteRecordAction}
        afterSuccessDMLAction={afterSuccessDMLAction}
        approveRecord={moderate.approveRecordAction}
        rejectRecord={moderate.rejectRecordAction}
      />      
      <RelationListUI
        title="Список источников автора:"
        genEntityURL={genSourceURL}
        list={record.currentRecord?.sources}
      />
      <RelationListUI
        title="Список идей по источникам автора:"
        genEntityURL={genIdeaURL}
        list={record.currentRecord?.ideas}
      />
      <RelationListUI
        title="Список ключевых слов по источникам автора:"
        genEntityURL={genKeywordURL}
        list={record.currentRecord?.keywords}
        prefix="#"
      />

    </RecordEditForm>
  );
};


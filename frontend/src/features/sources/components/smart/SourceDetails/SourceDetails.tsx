import { FC } from "react";
import { RecordEditForm } from "../../../../../shared/components/RecordEditForm/RecordEditForm"; 
import { InputEditUI } from "../../../../../shared/ui/fields/input-edit/input-edit"; 
import { InputSelectUI } from "../../../../../shared/ui/fields/input-select/input-select"; 
import { RelationList } from "../../../../../shared/components/RelationList/RelationList"; 
import styles from "./SourceDetails.module.css";
import { genHeaderText, EditAccessStatus, getUserCreator, getModerator } from "../../../../../shared/utils/utils";
import { Authorship } from "../../../../../shared/components/Authorship/Authorship"; 
import { SourceKeywords } from "../../ui/SourceKeywords/SourceKeywords"; 
import { LinkFieldUI } from "../../../../../shared/ui/fields/link-field/link-field"; 
import { genAuthorURL, genIdeaURL } from "../../../../../app/router/navigation";
import { User } from "../../../../auth/user-types";
import { useSourceDetails } from "../../../hooks/UseSourceDetails";
import { RecordControlBlock } from "../../../../../shared/components/RecordControlBlock/RecordControlBlock";

export type SourceDetailsProps = {
  id: string | undefined;
  currentUser: User | null;
  afterSuccessDMLAction: ()=>void;
};

/**
 * Компонент UI редактирования конкретного источника
 */
export const SourceDetails: FC<SourceDetailsProps> = (
  {id, currentUser, afterSuccessDMLAction}: SourceDetailsProps,
) => {

  const {form, status, record, moderate, authors} = useSourceDetails({id, currentUser});  
  const header = genHeaderText(
    status.editAccessStatus === EditAccessStatus.Readonly,
    id?Number(id):null,
    record.currentRecord?.name,
    "источника",
  );
  const btnCaptione = id ? "Сохранить данные" : "Добавить источник";

  
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
        userName={getUserCreator (record.currentRecord, currentUser)}
        moderatorName={getModerator(record.currentRecord)}
        className={styles.label_info}
      />
      <InputEditUI
        labelClassAdd={styles.label}
        name="name"
        label="Название источника:"
        value={form.values.name}
        placeholder="Укажите название источника"
        inputClassAdd={styles.input}
        classAdd={styles.input_block}
        readOnly={status.editAccessStatus === EditAccessStatus.Readonly}
        handleChange={form.handleChange}
      />
      {status.editAccessStatus === EditAccessStatus.Readonly ?
        <LinkFieldUI 
          label="Автор:"
          URL={genAuthorURL(form.values.author!.id)}
          URLText={record.currentRecord?.author?.name}
          classAdd={styles.input_block}
          labelClassAdd={styles.label}
        />
        :
        <InputSelectUI
          labelClassAdd={styles.label}
          name="author.id"
          label="Автор:"
          value={form.values.author ? form.values.author.id : 0}
          readOnly={false}
          selectClassAdd={styles.input}
          classAdd={styles.input_block}
          handleChange={form.handleChange}
          values={authors}
        />}
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
      {id && (
        <>
          <RelationList
            title="Список идей по источнику:"
            genEntityURL={genIdeaURL}
            list={record.currentRecord?.ideas}
          />
          <SourceKeywords
            title="Список ключевых слов идей по источнику:"
            source_id={Number(id)}
            keywordsAll={record.currentRecord?.keywords}
          />
        </>
      )}
    </RecordEditForm>
  );
};


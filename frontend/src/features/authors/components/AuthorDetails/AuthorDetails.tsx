import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { RecordEditForm } from "../../../../shared/components/RecordEditForm/RecordEditForm";
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit";
import {
  genHeaderText,
  EditAccessStatus,
  getUserCreator,
  getModerator,
  genTabHeaderText,
  HeaderParType,
} from "../../../../shared/utils/utils";
import { Authorship } from "../../../../shared/components/Authorship/Authorship";
import { RelationList } from "../../../../shared/components/RelationList/RelationList";
import styles from "./AuthorDetails.module.css";
import { User } from "../../../auth/user-types";
import { useAuthorDetails } from "../../hooks/UseAuthorDetails";
import { RecordControlBlock } from "../../../../shared/components/RecordControlBlock/RecordControlBlock";
import {
  genIdeaURL,
  genKeywordURL,
  genSourceURL,
} from "../../../../app/router/navigation";
import { BreadcrumbSimpeType } from "../../../../shared/components/Breadcrumbs/Breadcrumbs";

/**
 * Чистый компонент редактирования автора
 */
export type AuthorDetailsProps = {
  id: string | undefined;
  currentUser: User | null;
  afterSuccessDMLAction: () => void;
};

export const AuthorDetails: FC<AuthorDetailsProps> = ({
  id,
  currentUser,
  afterSuccessDMLAction,
}: AuthorDetailsProps) => {
  const { form, status, record, moderate } = useAuthorDetails({
    id,
    currentUser,
  });
  const params:HeaderParType=[
    status.editAccessStatus === EditAccessStatus.Readonly,
    id ? Number(id) : null,
    record.currentRecord?.name,
    "автора"]
  const header = genHeaderText(...params);
  const tabHeader = genTabHeaderText(...params);

  return (
    <>
      <Helmet>
        <title>{tabHeader}</title>
      </Helmet>

      <RecordEditForm
        formClass={styles.form}
        breadcrumbs={[BreadcrumbSimpeType.AuthorsList]}
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
        <RelationList
          title="Список источников автора:"
          genEntityURL={genSourceURL}
          list={record.currentRecord?.sources}
        />
        <RelationList
          title="Список идей по источникам автора:"
          genEntityURL={genIdeaURL}
          list={record.currentRecord?.ideas}
        />
        <RelationList
          title="Список ключевых слов по источникам автора:"
          genEntityURL={genKeywordURL}
          list={record.currentRecord?.keywords}
          prefix="#"
        />
      </RecordEditForm>
    </>
  );
};

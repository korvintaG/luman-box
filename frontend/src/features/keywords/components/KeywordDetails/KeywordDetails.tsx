import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { RecordEditForm } from "../../../../shared/components/RecordEditForm/RecordEditForm";
import { RecordControlBlock } from "../../../../shared/components/RecordControlBlock/RecordControlBlock";
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit";
import {
  genHeaderText,
  EditAccessStatus,
  getUserCreator,
  getModerator,
  HeaderParType,
  genTabHeaderText,
} from "../../../../shared/utils/utils";
import { Authorship } from "../../../../shared/components/Authorship/Authorship";
import { RelationList } from "../../../../shared/components/RelationList/RelationList";
import styles from "../../../../shared/CSS/StandartForm.module.css";
import {
  genAuthorURL,
  genIdeaURL,
  genSourceURL,
} from "../../../../app/router/navigation";
import { User } from "../../../auth/user-types";
import { useKeywordDetails } from "../../hooks/UseKeywordDetails";
import { BreadcrumbSimpeType } from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import {
  InputTextUI,
  LabelPosition,
} from "../../../../shared/ui/fields/input-text/input-text";

export type KeywordDetailsProps = {
  id: string | undefined;
  currentUser: User | null;
  afterSuccessDMLAction: () => void;
};

export const KeywordDetails: FC<KeywordDetailsProps> = ({
  id,
  currentUser,
  afterSuccessDMLAction,
}: KeywordDetailsProps) => {
  const { form, status, record, moderate } = useKeywordDetails({
    id,
    currentUser,
  });

  const params: HeaderParType = [
    status.editAccessStatus === EditAccessStatus.Readonly,
    id ? Number(id) : null,
    record.currentRecord?.name,
    "ключевого слова",
  ];
  const header = genHeaderText(...params);
  const tabHeader = genTabHeaderText(...params);
  const inputProps = {
    classes: {
      classLabelAdd: styles.label,
      classInputAdd: styles.input,
      classBlockAdd: styles.input_block,
    },
    readOnly: status.editAccessStatus === EditAccessStatus.Readonly,
    onChange: form.handleChange,
  };

  return (
    <>
      <Helmet>
        <title>{tabHeader}</title>
      </Helmet>

      <RecordEditForm
        formClass={styles.form}
        breadcrumbs={[BreadcrumbSimpeType.KeywordsList]}
        header={header}
        onSubmit={record.handleSubmitAction}
        sliceState={status.sliceStates}
        error={status.errorText}
        fetchRecord={record.fetchRecord}
      >
        <section className={styles.form__content}>
          <div className={styles.form__content__text}>
            <Authorship
              userName={getUserCreator(record.currentRecord, currentUser)}
              moderatorName={getModerator(record.currentRecord)}
              className={styles.label_info}
            />
            <InputEditUI
              name="name"
              label="Ключевое слово:"
              value={form.values.name}
              placeholder="Введите ключевое слово"
              {...inputProps}
            />
            <InputTextUI
              value={form.values.definition}
              name="definition"
              label="Определение:"
              labelPosition={LabelPosition.left}
              {...inputProps}
            />
          </div>
        </section>

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
          <section className={styles.aggregation}>
            <RelationList
              title="Список авторов, в идеях по источникам которых есть ключевое слово:"
              genEntityURL={genAuthorURL}
              list={record.currentRecord?.authors}
            />
            <RelationList
              title="Список источников, в идеях по которым есть ключевое слово:"
              genEntityURL={genSourceURL}
              list={record.currentRecord?.sources}
            />
            <RelationList
              title="Список идей, по которым есть ключевое слово:"
              genEntityURL={genIdeaURL}
              list={record.currentRecord?.ideas}
            />
          </section>
        )}
      </RecordEditForm>
    </>
  );
};

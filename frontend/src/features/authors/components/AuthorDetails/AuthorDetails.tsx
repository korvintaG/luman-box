import { FC, SyntheticEvent, useRef } from "react";
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
import styles from "../../../../shared/CSS/StandartForm.module.css";
import { User } from "../../../auth/user-types";
import { useAuthorDetails } from "../../hooks/UseAuthorDetails";
import { RecordControlBlock } from "../../../../shared/components/RecordControlBlock/RecordControlBlock";
import {
  genIdeaURL,
  genKeywordURL,
  genSourceURL,
} from "../../../../app/router/navigation";
import { BreadcrumbSimpeType } from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import {
  InputTextUI,
  LabelPosition,
} from "../../../../shared/ui/fields/input-text/input-text";
import { RecordImage } from "../../../../shared/components/RecordImage/RecordImage";

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
  const fileRef = useRef<HTMLInputElement | null>(null);

  const params: HeaderParType = [
    status.editAccessStatus === EditAccessStatus.Readonly,
    id ? Number(id) : null,
    record.currentRecord?.name,
    "автора",
  ];
  const header = genHeaderText(...params);
  const tabHeader = genTabHeaderText(...params);

  const inputProps = {
    classes: {
      classBlockAdd: styles.input_block,
      classLabelAdd: styles.label,
      classInputAdd: styles.input,
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
        breadcrumbs={[BreadcrumbSimpeType.AuthorsList]}
        header={header}
        onSubmit={record.handleSubmitAction}
        sliceState={status.sliceStates}
        error={status.errorText}
        fetchRecord={record.fetchRecord}
      >
        <section className={styles.form__content}>
          <RecordImage
            imageURL={form.values.image_URL}
            newImageURL={form.values.new_image_URL}
            readOnly={status.editAccessStatus === EditAccessStatus.Readonly}
            uploadFileAction={record.uploadFileAction}
            deleteImage={() =>
              form.setValues({ ...form.values, new_image_URL: null })
            }
          />
          <div className={styles.form__content__text}>
            {
              <Authorship
                userName={getUserCreator(record.currentRecord, currentUser)}
                moderatorName={getModerator(record.currentRecord)}
              />
            }
            <InputEditUI
              name="name"
              label="ФИО автора:"
              value={form.values.name}
              placeholder="Укажите ФИО автора"
              minLength={5}
              required
              {...inputProps}
            />
            <InputEditUI
              name="birth_date"
              label="Рождения год:"
              value={form.values.birth_date}
              placeholder="Укажите год рождения"
              minLength={2}
              required
              {...inputProps}
            />
            <InputEditUI
              name="birth_place"
              label="Город/страна:"
              value={form.values.birth_place}
              placeholder="Укажите место рождения"
              minLength={5}
              required
              {...inputProps}
            />
            <InputTextUI
              value={form.values.about_author}
              name="about_author"
              label="Об авторе:"
              labelPosition={LabelPosition.left}
              {...inputProps}
            />
          </div>
        </section>
        <RecordControlBlock
          id={id}
          sliceState={status.sliceStates[0]}
          resetSliceState={status.resetSlicesStatus}
          preparedSliceState={status.sliceStates[1]}
          error={status.errorText}
          editAccessStatus={status.editAccessStatus}
          deleteRecord={record.deleteRecordAction}
          afterSuccessDMLAction={afterSuccessDMLAction}
          approveRecord={moderate.approveRecordAction}
          rejectRecord={moderate.rejectRecordAction}
        />
      </RecordEditForm>
      {id && (
        <section className={styles.aggregation}>
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
        </section>
      )}
    </>
  );
};

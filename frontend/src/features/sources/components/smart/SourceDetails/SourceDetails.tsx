import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { RecordEditForm } from "../../../../../shared/components/RecordEditForm/RecordEditForm";
import { InputEditUI } from "../../../../../shared/ui/fields/input-edit/input-edit";
import { InputSelectUI } from "../../../../../shared/ui/fields/input-select/input-select";
import { RelationList } from "../../../../../shared/components/RelationList/RelationList";
import styles from "../../../../../shared/CSS/StandartForm.module.css";
import {
  genHeaderText,
  EditAccessStatus,
  getUserCreator,
  getModerator,
  HeaderParType,
  genTabHeaderText,
} from "../../../../../shared/utils/utils";
import { Authorship } from "../../../../../shared/components/Authorship/Authorship";
import { SourceKeywords } from "../../ui/SourceKeywords/SourceKeywords";
import { LinkFieldUI } from "../../../../../shared/ui/fields/link-field/link-field";
import { genAuthorURL, genIdeaURL } from "../../../../../app/router/navigation";
import { User } from "../../../../auth/user-types";
import { useSourceDetails } from "../../../hooks/UseSourceDetails";
import { RecordControlBlock } from "../../../../../shared/components/RecordControlBlock/RecordControlBlock";
import { BreadcrumbSimpeType } from "../../../../../shared/components/Breadcrumbs/Breadcrumbs";
import {
  InputTextUI,
  LabelPosition,
} from "../../../../../shared/ui/fields/input-text/input-text";
import { RecordImage } from "../../../../../shared/components/RecordImage/RecordImage";

export type SourceDetailsProps = {
  id: string | undefined;
  currentUser: User | null;
  afterSuccessDMLAction: () => void;
};

/**
 * Компонент UI редактирования конкретного источника
 */
export const SourceDetails: FC<SourceDetailsProps> = ({
  id,
  currentUser,
  afterSuccessDMLAction,
}: SourceDetailsProps) => {
  const { form, status, record, moderate, authors } = useSourceDetails({
    id,
    currentUser,
  });
  const params: HeaderParType = [
    status.editAccessStatus === EditAccessStatus.Readonly,
    id ? Number(id) : null,
    record.currentRecord?.name,
    "источника",
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
        breadcrumbs={[BreadcrumbSimpeType.SourcesList]}
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
            <Authorship
              userName={getUserCreator(record.currentRecord, currentUser)}
              moderatorName={getModerator(record.currentRecord)}
            />
            <InputEditUI
              name="name"
              label="Название источника:"
              value={form.values.name}
              placeholder="Укажите название источника"
              {...inputProps}
            />
            <InputSelectUI
              name="author.id"
              label="Автор:"
              values={authors}
              value={form.values.author ? form.values.author.id : 0}
              valueText={record.currentRecord?.author?.name}
              URL={genAuthorURL(form.values.author!.id)}
              {...inputProps}
            />
            <InputEditUI
              name="publication_year"
              label="Год публикации:"
              value={form.values.publication_year}
              placeholder="Укажите год публикации"
              {...inputProps}
            />
            <InputTextUI
              value={form.values.about_source}
              name="about_source"
              label="Об источнике:"
              labelPosition={LabelPosition.left}
              {...inputProps}
            />
          </div>
        </section>

        <RecordControlBlock
          id={id}
          sliceState={status.sliceStates[0]}
          preparedSliceState={status.sliceStates[1]}
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
              title="Список идей по источнику:"
              genEntityURL={genIdeaURL}
              list={record.currentRecord?.ideas}
            />
            <SourceKeywords
              title="Список ключевых слов идей по источнику:"
              source_id={Number(id)}
              keywordsAll={record.currentRecord?.keywords}
            />
          </section>
        )}
      </RecordEditForm>
    </>
  );
};

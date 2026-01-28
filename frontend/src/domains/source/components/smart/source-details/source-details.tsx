import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { RecordEditForm } from "../../../../../shared/components/RecordEditForm/RecordEditForm";
import { InputEditUI } from "../../../../../shared/ui/fields/input-edit/input-edit";
import { InputSelectUI } from "../../../../../shared/ui/fields/input-select/input-select";
import { RelationList } from "../../../../../shared/components/RelationList/RelationList";
import styles from "../../../../../shared/CSS/StandartForm.module.scss";
import {
  genHeaderText,
  EditAccessStatus,
  HeaderParType,
  genTabHeaderText,
} from "../../../../../shared/utils/utils";
import { Authorship } from "../../../../../shared/components/Authorship/ui/Authorship";
import { SourceKeywords } from "../../ui/SourceKeywords/SourceKeywords";
import { genAuthorURL, genIdeaURL, genSourceURL } from "../../../../../app/router/navigation";
import { useSourceDetails } from "../../../hooks/use-source-details";
import { RecordControlBlock } from "../../../../../shared/components/record-control-block/ui/record-control-block";
import { BreadcrumbSimpeType } from "../../../../../shared/components/Breadcrumbs/Breadcrumbs";
import {
  InputTextUI
} from "../../../../../shared/ui/fields/input-text/input-text";
import { RecordImage } from "../../../../../shared/components/record-image/record-image";
import { LabelPosition } from "../../../../../shared/types/ui-types";

export type SourceDetailsProps = {
  gotoSourceList: () => void;
  gotoSource: (id: number) => void;
  sourceDetailsHookRes: ReturnType<typeof useSourceDetails>;
};

export const SourceDetails: FC<SourceDetailsProps> = ({
  gotoSourceList,
  gotoSource,
  sourceDetailsHookRes,
}: SourceDetailsProps) => {
  const { form, status, record, authors } = sourceDetailsHookRes;
  const params: HeaderParType = [
    status.editAccessStatus === EditAccessStatus.Readonly,
    record.currentRecord?.id ? Number(record.currentRecord?.id) : null,
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
    onChange: form?.handleChange,
  };

  console.log('form values',form.values)

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
            imageURL={form?.values.image_URL ?? null}
            newImageURL={form ? form.values.new_image_URL : undefined}
            readOnly={status.editAccessStatus === EditAccessStatus.Readonly}
            uploadFileAction={record.uploadFileAction}
            deleteImage={() => {
              console.log('delete image !!!!!!')
              form?.setEditStarted(true);
              form?.setValues({ ...form?.values, new_image_URL: null })
            }}
          />
          <div className={styles.form__content__text}>
            {record.currentRecord &&
              <Authorship
                record={record.currentRecord}
                entityName="Источник"
                divSpacer
            />}
            <InputEditUI
              name="name"
              label="Название источника:"
              value={form?.values.name}
              placeholder="Укажите название источника"
              dataCy="source_name"
              divSpacer
              {...inputProps}
            />
            <InputSelectUI
              name="author.id"
              label="Автор:"
              values={authors}
              value={form?.values.author ? form?.values.author.id : 0}
              valueText={record.currentRecord?.author?.name}
              URL={genAuthorURL(form?.values.author?.id ?? 0)}
              divSpacer
              dataCy="source_author"
              {...inputProps}
            />
            <InputEditUI
              name="publication_year"
              label="Год публикации:"
              value={form?.values.publication_year}
              placeholder="Укажите год публикации"
              dataCy="source_publication_year"
              divSpacer
              {...inputProps}
            />
            <InputTextUI
              value={form?.values.about_source}
              name="about_source"
              label="Об источнике:"
              labelPosition={LabelPosition.left} 
              dataCy="source_about"
              {...inputProps}
            />
          </div>
        </section>

        <RecordControlBlock
          gotoEntityList={gotoSourceList}
          gotoEntityEdit={gotoSource}
          entityDetailsHook={sourceDetailsHookRes}
        />
        {record.currentRecord?.id && (
          <section className={styles.aggregation}>
            <RelationList
              title="Список идей по источнику:"
              genEntityURL={genIdeaURL}
              list={record.currentRecord?.ideas}
            />
            <SourceKeywords
              title="Список ключевых слов идей по источнику:"
              source_id={Number(record.currentRecord?.id)}
              keywordsAll={record.currentRecord?.keywords ? 
                record.currentRecord.keywords : []}
            />
          </section>
        )}
      </RecordEditForm>
    </>
  );
};

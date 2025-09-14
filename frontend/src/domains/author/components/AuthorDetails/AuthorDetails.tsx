import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { RecordEditForm } from "../../../../shared/components/RecordEditForm/RecordEditForm";
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit";
import {
  genHeaderText,
  EditAccessStatus,
  genTabHeaderText,
  HeaderParType,
} from "../../../../shared/utils/utils";
import { Authorship } from "../../../../shared/components/Authorship/ui/Authorship";
import { RelationList } from "../../../../shared/components/RelationList/RelationList";
import styles from "../../../../shared/CSS/StandartForm.module.css";
import { useAuthorDetails } from "../../hooks/UseAuthorDetails";
import { RecordControlBlock } from "../../../../shared/components/RecordControlBlock/ui/RecordControlBlock";
import {
  genAuthorURL,
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
import { AuthorAdd, AuthorDetail } from "../../types/author-type";

/**
 * Чистый компонент редактирования автора
 */
export type AuthorDetailsProps = {
  //id: string | undefined;
  //currentUser: User | null;
  authorDetailsHookRes: ReturnType<typeof useAuthorDetails>;
  gotoAuthorList: () => void;
  gotoAuthor: (id: number) => void;
};

export const AuthorDetails: FC<AuthorDetailsProps> = ({
  authorDetailsHookRes,
  gotoAuthorList,
  gotoAuthor,
}: AuthorDetailsProps) => {
  /*const authorDetailsHook = useAuthorDetails({
    id,
    currentUser,
  });*/
  const { form, status, record } = authorDetailsHookRes;
  //const fileRef = useRef<HTMLInputElement | null>(null);

  const params: HeaderParType = [
    status.editAccessStatus === EditAccessStatus.Readonly,
    record.currentRecord?.id ? Number(record.currentRecord?.id) : null,
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
            deleteImage={() => {
              form.setEditStarted(true);
              form.setValues({ ...form.values, new_image_URL: null });
            }}
          />
          <div className={styles.form__content__text}>
            {record.currentRecord &&
              <Authorship
                record={record.currentRecord}
                entityName="Автор"
              />
            }
            <InputEditUI
              name="name"
              label="ФИО автора:"
              value={form.values.name}
              placeholder="Укажите ФИО автора"
              minLength={5}
              dataCy="author_name"
              required
              {...inputProps}
            />
            <InputEditUI
              name="birth_date"
              label="Рождения год:"
              value={form.values.birth_date}
              placeholder="Укажите год рождения"
              minLength={2}
              dataCy="author_birth_date"
              required
              {...inputProps}
            />
            <InputEditUI
              name="birth_place"
              label="Город/страна:"
              value={form.values.birth_place}
              placeholder="Укажите место рождения"
              minLength={5}
              dataCy="author_birth_place"
              required
              {...inputProps}
            />
            <InputTextUI
              value={form.values.about_author}
              name="about_author"
              label="Об авторе:"
              labelPosition={LabelPosition.left}
              dataCy="author_about"
              {...inputProps}
            />
          </div>
        </section>
        <RecordControlBlock
          entityDetailsHook={authorDetailsHookRes}
          gotoEntityList={gotoAuthorList}
          gotoEntityEdit={gotoAuthor}
        />
      </RecordEditForm>
      {record.currentRecord?.id && (
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

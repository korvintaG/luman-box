import { FC, SetStateAction, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { RecordEditForm } from "../../../../shared/components/RecordEditForm/RecordEditForm";
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit";
import {
  genHeaderText,
  EditAccessStatus,
  HeaderParType,
  genTabHeaderText,
  formatMoscowDateTime,
} from "../../../../shared/utils/utils";
import { Authorship } from "../../../../shared/components/Authorship/ui/Authorship";
import { RelationList } from "../../../../shared/components/RelationList/RelationList";
import styles from "../../../../shared/CSS/StandartForm.module.scss";
import {
  genAuthorURL,
  genIdeaURL,
  genSourceURL,
  genKeywordsByClassURL,
} from "../../../../app/router/navigation";
import { useKeywordDetails } from "../../hooks/use-keyword-details";
import { BreadcrumbSimpeType, Breadcrumb } from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import {
  InputTextUI,
} from "../../../../shared/ui/fields/input-text/input-text";
import { RecordControlBlock } from "../../../../shared/components/record-control-block";
import { LabelPosition } from "../../../../shared/types/ui-types";
import { editAccessStatus2Synonyms, SynonymsIDs } from "../../../../shared/components/SynonymsIDs/synonyms-ids";
import { KeywordNameEdit } from "../../types/keyword-types";
import { SimpleObjectToAdd, SimpleNameObject, VerificationStatus } from "../../../../shared/types/entity-types";
import { DivSpacer } from "../../../../shared/ui/div-spacer/div-spacer";
import { Link } from "react-router-dom";

export type KeywordDetailsProps = {
  gotoList: () => void;
  gotoEdit: (id: number) => void;
  keywordDetailsHook: ReturnType<typeof useKeywordDetails>;
};

export const KeywordDetails: FC<KeywordDetailsProps> = ({
  gotoList,
  gotoEdit,
  keywordDetailsHook,
}: KeywordDetailsProps) => {
  const { form, status, record } = keywordDetailsHook;
  
  const bcs = useMemo(() => {
    const breadcrumbs: Breadcrumb[] = [BreadcrumbSimpeType.KeywordsList];
    
    if (record?.currentRecord?.bread_crumbs) {
      try {
        const parsedBreadcrumbs = JSON.parse(record.currentRecord.bread_crumbs) as SimpleNameObject[];
        const breadcrumbItems = parsedBreadcrumbs.map(item => ({
          name: item.name,
          path: genKeywordsByClassURL(item.id)
        }));
        breadcrumbs.push(...breadcrumbItems);
      } catch (error) {
        console.error('Ошибка парсинга bread_crumbs:', error);
      }
    }
    
    return breadcrumbs;
  }, [record?.currentRecord])

  const params: HeaderParType = [
    status.editAccessStatus === EditAccessStatus.Readonly,
    record.currentRecord?.id ? Number(record.currentRecord?.id) : null,
    record.currentRecord?.name,
    "ключевого слова",
  ];
  const header = genHeaderText(...params);
  const tabHeader = genTabHeaderText(...params);
  const inputProps = {
    readOnly: status.editAccessStatus === EditAccessStatus.Readonly,
    onChange: form?.handleChange,
  };

  const wasOptionalyInserted:boolean=!!(record.currentRecord 
    && record.currentRecord.names
    && record.currentRecord.names.filter(el=>el.verification_status === VerificationStatus.Creating).length>0)

  const synonymsEditStatus=useMemo(()=>{
    const newEditStatus=editAccessStatus2Synonyms(status.editAccessStatus)
    console.log('synonymsEditStatus',newEditStatus)
    return newEditStatus;
  },
  [status.editAccessStatus])


  return (
    <>
      <Helmet>
        <title>{tabHeader}</title>
      </Helmet>

      <RecordEditForm
        formClass={styles.form}
        breadcrumbs={bcs}
        header={header}
        onSubmit={record.handleSubmitAction}
        sliceState={status.sliceStates}
        error={status.errorText}
        fetchRecord={record.fetchRecord}
      >
        <section className={styles.form__content}>
          <div className={styles.form__content__text}>
            {record.currentRecord &&
              <Authorship
                record={record.currentRecord}
                entityName="Ключевое слово"
                className={styles.label_info}
            />}
            <DivSpacer size='middle'/>
            <InputEditUI
              name="name"
              label="Ключевое слово:"
              value={form?.values.name ?? ""}
              placeholder="Введите ключевое слово"
              dataCy="keyword_name"
              {...inputProps}
              readOnly={[EditAccessStatus.EditableAndModeratableInserted,
                EditAccessStatus.Readonly,
                EditAccessStatus.PossibleInsert].includes(status.editAccessStatus)}
            />
            {(!inputProps.readOnly || form.values.names.length>2) &&
            <>
            <DivSpacer/>
            <label className={styles.label}>Варианты:</label>
            <SynonymsIDs
              componentName="keywords_names"
              editAccess={synonymsEditStatus}
              synonyms={form.values.names}
              primarySynonymIndex={form.values.default_name_index}
              setSynonyms={(value: SetStateAction<SimpleObjectToAdd[]>) => {
                const newNames = typeof value === 'function' ? value(form.values.names || []) : value;
                form.setFieldValueDirect?.('names', newNames);
              }}
              setPrimarySynonymIndex={(value: SetStateAction<number | undefined>) => {
                const newValue = typeof value === 'function' ? value(form.values.default_name_index ?? undefined) : value;
                //console.log('setPrimarySynonymIndex',newValue)
                form.setFieldValueDirect?.('default_name_index', newValue);
              }}
            />
            </>}
            <DivSpacer/>
            <InputTextUI
              value={form?.values.definition ?? ""}
              name="definition"
              label="Определение:"
              labelPosition={LabelPosition.left}
              dataCy="keyword_definition"
              {...inputProps}
              readOnly={[EditAccessStatus.Readonly, 
                EditAccessStatus.EditableAndModeratableInserted,
                EditAccessStatus.PossibleInsert].includes(status.editAccessStatus)}
            />
            {status.editAccessStatus!==EditAccessStatus.EditableAndModeratableInserted 
              && record.currentRecord?.moderations 
              && record.currentRecord.moderations.length>0 &&
              <>
              <DivSpacer count={3}/>
              <section className={styles.moderation}>
                  <h2 className={styles.section_header}>Очередь на модерацию:</h2>
                  <ul className={styles.moderation_list}>
                    {record.currentRecord.moderations.map((el)=><li key={el.id}>
                        <Link to={"?keywords_moderation_id="+el.id}>
                          {formatMoscowDateTime(el.date_time_create)} от {el.user.name}
                        </Link>
                      </li>)}  
                  </ul>
              </section>
              </>
            }
          </div>
        </section>

        <RecordControlBlock
          gotoEntityList={gotoList}
          gotoEntityEdit={gotoEdit}
          entityDetailsHook={keywordDetailsHook}
          wasOptionalyInserted={wasOptionalyInserted}
        />
        {/*record.currentRecord?.id && (
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
        )*/}
      </RecordEditForm>

    </>
  );
};

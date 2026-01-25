import { FC, useState, ChangeEvent, SetStateAction, Dispatch } from "react";
import { InputTextUI } from "../../../../shared/ui/fields/input-text/input-text";
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit";
import { TrashIcon } from "@heroicons/react/24/outline";
import styles from "../../../../shared/CSS/StandartForm.module.scss";
import localStyles from "./keyword-add.module.css";
import { HTMLEditElement } from "../../../../shared/types/types-for-hooks";
import { useSelector } from "../../../../shared/services/store";
import { selectCurrentKeyword } from "../../store/keyword-detail-slice";
import { Breadcrumb, Breadcrumbs } from "../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { genKeywordsByClassURL } from "../../../../app/router/navigation";
import { SimpleNameObject } from "../../../../shared/types/entity-types";
import { Synonyms } from "../../../../shared/components/Synonyms/synonyms";
import { LabelPosition } from "../../../../shared/types/ui-types";
import { RecordControlBlock } from "../../../../shared/components/record-control-block";
import { useKeywordDetailsAdd } from "../../hooks/use-keyword-add";
import { convertAddToEditHook } from "../../../../shared/utils/utils";
import { RecordEditForm } from "../../../../shared/components/RecordEditForm/RecordEditForm";

export type KeywordAddProps = {
  gotoList: () => void;
  gotoEdit: (id: number) => void;
  keywordAddDetailsHook: ReturnType<typeof useKeywordDetailsAdd>;
}

export const KeywordAdd: FC<KeywordAddProps> = ({
  gotoList, gotoEdit,  keywordAddDetailsHook
}) => {
  
  const { form, status, record } = keywordAddDetailsHook;


  let breadCrumbs :Breadcrumb[] = [
    {
      path: genKeywordsByClassURL(0),
      name: "Ключевые слова",
    },
  ];
  if (record.currentRecord ) {
    if (record.currentRecord.bread_crumbs) {
        const bcLoad = (JSON.parse(record.currentRecord.bread_crumbs) as SimpleNameObject[]).map(item => ({
            name: item.name,
            path: genKeywordsByClassURL(item.id)
        }));
      breadCrumbs.push(...bcLoad);
    }
    if (record.currentRecord.name) {
        breadCrumbs.push({
        path: genKeywordsByClassURL(record.currentRecord.id),
        name: record.currentRecord.name,
        });
    }
  }

  return (
      <RecordEditForm
        breadcrumbs={breadCrumbs}
        formClass={localStyles.main}
        onSubmit={record.handleSubmitAction}
        sliceState={status.sliceStates}
        error={status.errorText}
        fetchRecord={record.fetchRecord}
      >

        {/*breadCrumbs && <Breadcrumbs breadcrumbElementTypes={breadCrumbs} /*/}
        <div className={localStyles.content}>
            <div className={localStyles.header}>
              <h1 >Добавление нового ключевого слова:</h1>
              <p className={localStyles.primary_synonym}>
                  {form.values.default_name_index !==undefined ?
                    form.values.names[form.values.default_name_index] :''
                    }
              </p>
            </div>

          {form?.values.names && <Synonyms
            name="names"
            synonyms={form?.values.names}
            primarySynonymIndex={form.values.default_name_index}
            setSynonyms={(value: SetStateAction<string[]>) => {
              const newNames = typeof value === 'function' ? value(form.values.names || []) : value;
              form.setFieldValueDirect?.('names', newNames);
            }}
            setPrimarySynonymIndex={(value: SetStateAction<number | undefined>) => {
              const newValue = typeof value === 'function' ? value(form.values.default_name_index ?? undefined) : value;
              //console.log('setPrimarySynonymIndex',newValue)
              form.setFieldValueDirect?.('default_name_index', newValue);
            }}
          />}
          <InputTextUI
            value={form?.values.definition}
            name="definition"
            label="Определение ключевого слова:"
            labelPosition={LabelPosition.groupHeader}
            dataCy="keyword_memo"
            onChange={form?.handleChange}
          />
        </div>
        {keywordAddDetailsHook && <RecordControlBlock
          gotoEntityList={gotoList}
          gotoEntityEdit={gotoEdit}
          entityDetailsHook={convertAddToEditHook(keywordAddDetailsHook)}
        />}
    </RecordEditForm>
  );
}

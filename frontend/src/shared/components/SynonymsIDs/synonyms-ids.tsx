import React, { ChangeEvent, Dispatch, FC, SetStateAction, useEffect } from "react";
import styles from "./synonyms-ids.module.css";
import { InputEditUI, InputEditUIProps, ReadOnlyDecor } from "../../ui/fields/input-edit/input-edit";
import { HTMLEditElement } from "../../types/types-for-hooks";
import { TrashIcon } from "@heroicons/react/24/outline";
import { SimpleObjectToAdd, SimpleObjectToAddWithRO, SimpleObjectToAddWithVerify, VerificationStatus } from "../../types/entity-types";
import clsx from "clsx";
import { EditAccessStatus } from "../../utils/utils";

export type SynonymsEditAccess='readOnly' | 'editable' | 'insertable';

export type SynonymsIDsProps = {
  isShowLabel?: boolean;
  componentName?: string;
  synonyms: SimpleObjectToAddWithRO[];
  primarySynonymIndex?: number;
  setSynonyms: Dispatch<SetStateAction<SimpleObjectToAdd[]>>;
  setPrimarySynonymIndex: Dispatch<SetStateAction<number | undefined>>
  editAccess: SynonymsEditAccess;
}

export function editAccessStatus2Synonyms(editAccessStatus:EditAccessStatus): SynonymsEditAccess {
  switch (editAccessStatus) {
    case EditAccessStatus.Readonly:
    case EditAccessStatus.Moderatable:
    case EditAccessStatus.EditableAndModeratableInserted:
      //console.log('editAccessStatus2Synonyms',editAccessStatus,'readOnly')
      return 'readOnly'
    case EditAccessStatus.PossibleInsert:
      //console.log('editAccessStatus2Synonyms',editAccessStatus,'insertable')
      return 'insertable'
    default:
      //console.log('editAccessStatus2Synonyms',editAccessStatus,'editable')
      return 'editable'
  }
}



export const SynonymsIDs: FC<SynonymsIDsProps> = ({
  componentName,
  synonyms,
  primarySynonymIndex,
  setPrimarySynonymIndex,
  setSynonyms,
  isShowLabel,
  editAccess
}) => {

  console.log('SynonymsIDs',synonyms,'editAccess', editAccess)

  // удаление синонима
  const handleRemoveSynonym = (index: number) => {
    if (synonyms.length > 1 && synonyms[index].name !== "") {
      const newSynonyms = synonyms.filter((_, i) => i !== index);
      const wasPrimarySynonym = primarySynonymIndex === index;

      // Обновляем индекс основного синонима (если это не основной)
      if (primarySynonymIndex && !wasPrimarySynonym) {
        if (primarySynonymIndex > index) {
          // Если основной синоним был после удаленного, уменьшаем индекс
          setPrimarySynonymIndex(primarySynonymIndex - 1);
        }
      }

      // Находим индекс последнего непустого элемента
      let lastNonEmptyIndex = -1;
      for (let i = newSynonyms.length - 1; i >= 0; i--) {
        if (newSynonyms[i].name !== "") {
          lastNonEmptyIndex = i;
          break;
        }
      }

      // Удаляем все пустые поля после последнего непустого
      if (lastNonEmptyIndex >= 0) {
        newSynonyms.splice(lastNonEmptyIndex + 1);
        // Добавляем одно пустое поле в конец
        newSynonyms.push({name:""});
      } else {
        // Если все поля пустые, оставляем только одно
        newSynonyms.length = 1;
        newSynonyms[0].name = "";
      }

      // Если удалили основной синоним, выбираем первый непустой как основной
      if (wasPrimarySynonym) {
        const firstNonEmptyIndex = newSynonyms.findIndex(s => s.name !== "");
        if (firstNonEmptyIndex >= 0) {
          setPrimarySynonymIndex(firstNonEmptyIndex);
        } else {
          // Если нет непустых синонимов, сбрасываем выбор
          setPrimarySynonymIndex(undefined);
        }
      }

      setSynonyms(newSynonyms);
    }
  };

  // установка текущего синонима основным
  const handlePrimarySynonymChange = (index: number) => {
    if (editAccess!=='editable') return; // не позволяем изменять в режиме только чтения
    setPrimarySynonymIndex(index);
  };


  // основное - что то вводим в поле синонима
  const handleSynonymChange = (index: number, value: string) => {
    //if (editAccess==='readOnly') return; // не позволяем изменять в режиме только чтения
    const newSynonyms = [...synonyms];
    const oldValue = newSynonyms[index].name;
    newSynonyms[index].name = value;

    // Если начали заполнять пустое поле - добавить новое пустое поле в конец
    if (oldValue === "" && value !== "") {
      // Всегда добавляем пустое поле в конец, если его там нет
      const lastIsEmpty = newSynonyms[newSynonyms.length - 1].name === "";
      if (!lastIsEmpty) {
        newSynonyms.push({name:""});
      }

      // Если это первый заполненный синоним, автоматически делаем его основным
      const hasOtherNonEmpty = newSynonyms.some((s, i) => i !== index && s.name !== "");
      if (!hasOtherNonEmpty || primarySynonymIndex === undefined) {
        //console.log('primarySynonymIndex зашли ставить ',index)
        setPrimarySynonymIndex(index);
      }
    }

    // Если очистили заполненное поле - удаляем все пустые поля, где бы они не были
    if (oldValue !== "" && value === "") {
      console.log('очистили заполненное поле')
      // Если очистили основной синоним, сбрасываем выбор
      if (primarySynonymIndex === index) {
        setPrimarySynonymIndex(undefined);
      }

      // Удаляем все пустые поля из массива
      const filteredSynonyms = newSynonyms.filter(s => s.name !== "");
      
      // Если после фильтрации остались только заполненные поля, добавляем одно пустое в конец
      // Если все поля были пустые, оставляем только одно пустое поле
      if (filteredSynonyms.length > 0) {
        filteredSynonyms.push({name:""});
        newSynonyms.length = 0;
        newSynonyms.push(...filteredSynonyms);
      } else {
        // Если все поля пустые, оставляем только одно
        newSynonyms.length = 1;
        newSynonyms[0].name = "";
      }
    }

    setSynonyms(newSynonyms);
  };

  useEffect(()=>{
    if (synonyms.length===0 && editAccess!=='readOnly') {
      setSynonyms([{name:""}]); // инициализируем, чтобы было куда вводить
    }
  },[])


  return (<div className={isShowLabel?styles.container:styles.container_simple}>
    {synonyms.map((synonym, index) => {
      if (editAccess==='readOnly' && synonyms[index].name === "")  // не выводим в режиме просмотра последнюю строчку
        return null;
      else return  <React.Fragment key={`synonym_${index}`}>
        <div className={styles.radio_button_container}>
          {synonyms[index].name !== "" ? (
            <input
              disabled={editAccess==='readOnly' || editAccess==='insertable'}
              type="radio"
              name="primary_synonym"
              id={`${componentName}_primary_synonym_${index}`}
              checked={primarySynonymIndex === index}
              onChange={() => handlePrimarySynonymChange(index)}
              className={styles.radio_button}
              data-cy={`${componentName}_primary_synonym_${index}`}
              aria-label="Выбрать основным названием"
            />
          ): <div className={styles.radio_spacer}/>}
        </div>
        <InputEditUI
          readOnly={synonym.readOnly}
          errorModerationText={synonym.moderation_notes}
          readOnlyDecor={
            synonym.verification_status === VerificationStatus.ToModerate ? ReadOnlyDecor.ToModerate
            :(synonym.verification_status === VerificationStatus.Rejected ? ReadOnlyDecor.Rejected : undefined)}
          name={`${componentName}_array_${index}`}
          value={synonym.name}
          placeholder="Введите название"
          dataCy={`${componentName}_array_${index}`}
          onChange={(e: ChangeEvent<HTMLEditElement>) => {
            //console.log('ChangeEvent<HTMLEditElement>',e)
            handleSynonymChange(index, e.target.value)
            }
          }
        />
        <div className={styles.row_button_container}>
          {(!synonyms[index].readOnly)
            && synonyms[index].name !== "" && (
            <button
              type="button"
              onClick={() => handleRemoveSynonym(index)}
              data-cy={`remove_${componentName}_array_${index}`}
              className={styles.delete_button}
              aria-label="Удалить синоним"
            >
              <TrashIcon className={styles.deleteIcon} />
            </button>
          )}
        </div>

      </React.Fragment>
      })}
  </div>);
}
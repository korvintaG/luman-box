import React, { ChangeEvent, Dispatch, FC, SetStateAction, useEffect } from "react";
import styles from "./synonyms.module.css";
import { InputEditUI, InputEditUIProps } from "../../ui/fields/input-edit/input-edit";
import { HTMLEditElement } from "../../types/types-for-hooks";
import { TrashIcon } from "@heroicons/react/24/outline";

export type SynonymsProps = {
  name: string;
  synonyms: string[];
  primarySynonymIndex?: number;
  setSynonyms: Dispatch<SetStateAction<string[]>>;
  setPrimarySynonymIndex: Dispatch<SetStateAction<number | undefined>>
}

export const Synonyms: FC<SynonymsProps> = ({
  name,
  synonyms,
  primarySynonymIndex,
  setPrimarySynonymIndex,
  setSynonyms,
}) => {

  // удаление синонима
  const handleRemoveSynonym = (index: number) => {
    if (synonyms.length > 1 && synonyms[index] !== "") {
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
        if (newSynonyms[i] !== "") {
          lastNonEmptyIndex = i;
          break;
        }
      }

      // Удаляем все пустые поля после последнего непустого
      if (lastNonEmptyIndex >= 0) {
        newSynonyms.splice(lastNonEmptyIndex + 1);
        // Добавляем одно пустое поле в конец
        newSynonyms.push("");
      } else {
        // Если все поля пустые, оставляем только одно
        newSynonyms.length = 1;
        newSynonyms[0] = "";
      }

      // Если удалили основной синоним, выбираем первый непустой как основной
      if (wasPrimarySynonym) {
        const firstNonEmptyIndex = newSynonyms.findIndex(s => s !== "");
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
    setPrimarySynonymIndex(index);
  };


  // основное - что то вводим в поле синонима
  const handleSynonymChange = (index: number, value: string) => {
    const newSynonyms = [...synonyms];
    const oldValue = newSynonyms[index];
    newSynonyms[index] = value;

    // Если начали заполнять пустое поле - добавить новое пустое поле в конец
    if (oldValue === "" && value !== "") {
      // Всегда добавляем пустое поле в конец, если его там нет
      const lastIsEmpty = newSynonyms[newSynonyms.length - 1] === "";
      if (!lastIsEmpty) {
        newSynonyms.push("");
      }

      // Если это первый заполненный синоним, автоматически делаем его основным
      const hasOtherNonEmpty = newSynonyms.some((s, i) => i !== index && s !== "");
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
      const filteredSynonyms = newSynonyms.filter(s => s !== "");
      
      // Если после фильтрации остались только заполненные поля, добавляем одно пустое в конец
      // Если все поля были пустые, оставляем только одно пустое поле
      if (filteredSynonyms.length > 0) {
        filteredSynonyms.push("");
        newSynonyms.length = 0;
        newSynonyms.push(...filteredSynonyms);
      } else {
        // Если все поля пустые, оставляем только одно
        newSynonyms.length = 1;
        newSynonyms[0] = "";
      }
    }

    setSynonyms(newSynonyms);
  };

  useEffect(()=>{
    if (synonyms.length===0) {
      setSynonyms([""]); // инициализируем, чтобы было куда вводить
    }
  },[])

  return (<div className={styles.container}>
    {synonyms.map((synonym, index) => (
      <React.Fragment key={`synonym_${index}`}>
        <div className={styles.radio_button_container}>
          {synonyms[index] !== "" && (
            <input
              type="radio"
              name="primary_synonym"
              id={`${name}_primary_synonym_${index}`}
              checked={primarySynonymIndex === index}
              onChange={() => handlePrimarySynonymChange(index)}
              className={styles.radio_button}
              data-cy={`${name}_primary_synonym_${index}`}
              aria-label="Выбрать основным названием"
            />
          )}
        </div>
        <InputEditUI
          name={`${name}_array_${index}`}
          value={synonym}
          placeholder="Введите название"
          dataCy={`${name}_array_${index}`}
          onChange={(e: ChangeEvent<HTMLEditElement>) =>
            handleSynonymChange(index, e.target.value)
          }
        />
        <div className={styles.row_button_container}>
          {synonyms[index] !== "" && (
            <button
              type="button"
              onClick={() => handleRemoveSynonym(index)}
              data-cy={`remove_${name}_array_${index}`}
              className={styles.delete_button}
              aria-label="Удалить синоним"
            >
              <TrashIcon className={styles.deleteIcon} />
            </button>
          )}
        </div>
      </React.Fragment>
    ))}
  </div>);
}
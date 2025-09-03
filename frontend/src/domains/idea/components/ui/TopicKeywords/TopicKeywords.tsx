import { useState, FC, ChangeEvent, SyntheticEvent } from "react";
import clsx from "clsx";
import {  KeywordShort } from "../../../../keyword/types/KeywordTypes";
import { KeywordUI } from "../Keyword";
import { InputSelectUI } from "../../../../../shared/ui/fields/input-select/input-select";
import styles from "./TopicKeywords.module.css";
import { HTMLEditElement } from "../../../../../shared/types/types-for-hooks";

export type TopicKeywordsProps = {
  keywordsAll: KeywordShort[]; // ключевые слова для выбора
  keywordsSelected: KeywordShort[];
  readOnly?: boolean;
  deleteKeyword: (e: SyntheticEvent, id: number) => void; // удалить ключевое слово к идеи
  addKeyword: (id: number) => void; // добавить ключевое слово к идеи
};

export const TopicKeywords: FC<TopicKeywordsProps> = (props) => {
  const [keywordToAdd, setKeywordToAdd] = useState(0);

  function getKeywordName(id: number): string {
    const kw = props.keywordsAll.find((el) => el.id === id);
    if (kw) return kw.name;
    else return "";
  }

  function changeKeywordToAdd(e: ChangeEvent<HTMLEditElement>) {
    const { value } = e.target;
    props.addKeyword(Number(value));
    setKeywordToAdd(0);
  }

  return (
    <div
      className={clsx(styles.keywords_block, {
        [styles.keywords_block_border]: !props.readOnly,
      })}
    >
      {props.keywordsSelected ? (
        <div className={styles.keywords}>
          {props.keywordsSelected.map((kw) => (
            <KeywordUI
              key={kw.id}
              id={kw.id}
              name={getKeywordName(kw.id)}
              readOnly={props.readOnly}
              deleteKeyword={props.deleteKeyword}
            />
          ))}
        </div>
      ) : null}

      {!props.readOnly && (
        <div className={styles.keyword_select}>
          <InputSelectUI
            name="keyword_id"
            label="Добавить ключевое слово:"
            value={keywordToAdd}
            values={props.keywordsAll.filter(
              (el) => !props.keywordsSelected.find((fel) => fel.id === el.id)
            )} // только новые
            onChange={changeKeywordToAdd}
          />
        </div>
      )}
    </div>
  );
};

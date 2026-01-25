import { FC, SyntheticEvent, useCallback } from "react";
import clsx from "clsx";
import {  KeywordSummary, KeywordSearchResult } from "../../../../keyword/types/keyword-types";
import { KeywordUI } from "../Keyword";
import styles from "./topic-keywords.module.scss";
import { Tooltip } from "react-tooltip";
import { AutocompleteInput } from "../../../../../shared/components/auto-complete-input/auto-complete-input";
import { KeywordNameObject } from "../../../types/IdeaTypes";

export type TopicKeywordsProps = {
  //keywordsAll: KeywordSummary[]; // ключевые слова для выбора
  keywordsSelected: KeywordSummary[];
  readOnly?: boolean;
  deleteKeyword: (e: SyntheticEvent, id: number) => void; // удалить ключевое слово к идеи
  addKeyword: (item: KeywordNameObject) => void; // добавить ключевое слово к идеи
  searchKeyword: (token: string) => Promise<KeywordSearchResult[]>; // поиск ключевого слова
};

export const TopicKeywords: FC<TopicKeywordsProps> = (props) => {
  console.log('TopicKeywords',props.keywordsSelected)

  const getKeywordName = (id: number): string => "keyword_"+id
  
  const handleKeywordSelect = (item: KeywordSearchResult | null) => {
    console.log('handleKeywordSelect', item);
    if (item) {
      props.addKeyword(item);
    }
  }



  // Мемоизируем searchFunction, чтобы избежать пересоздания при каждом рендере
  const searchFunction = useCallback(async (query: string): Promise<KeywordSearchResult[]> => {
    return await props.searchKeyword(query);
  }, [props.searchKeyword]);

  return (
    <div
      className={clsx(styles.keywords_block, {
        [styles.keywords_block_border]: !props.readOnly,
      })}
    >
      {props.keywordsSelected ? (
        <div className={styles.keywords}>
          {props.keywordsSelected.map((kw, index) => ( <>
            <KeywordUI
              dataCy={`keyword_link_${index}`}
              key={kw.id}
              id={kw.id}
              name={kw.name}
              readOnly={props.readOnly}
              deleteKeyword={props.deleteKeyword}
              tooltipId= {getKeywordName(kw.id)}
              tooltipContent= {kw.class_name_before}
            />
            <Tooltip
            id={getKeywordName(kw.id)}
            place="top-start"
            />
          </>
    
          ))}
        </div>
      ) : null}

      {!props.readOnly && (
        <div className={styles.keyword_select}>
          <AutocompleteInput<KeywordSearchResult>
            label="Добавить ключевое слово:"
            searchFunction={searchFunction}
            getDisplayText={(item) => `${item.class_name_before} / ${item.name}`}
            getValue={(item) => item.id}
            minChars={3}
            onSelect={handleKeywordSelect}
            placeholder="Введите минимум 3 символа для поиска..."
            dataCy="keyword-autocomplete"
            readOnly={props.readOnly}
          />
        </div>
      )}
          
      {/* !props.readOnly && (
        <div className={styles.keyword_select}>
          <InputSelectUI
            name="keyword_id"
            label="Добавить ключевое слово:"
            value={keywordToAdd}
            dataCy="keyword"
            values={props.keywordsAll.filter(
              (el) => !props.keywordsSelected.find((fel) => fel.id === el.id)
            )} // только новые
            onChange={changeKeywordToAdd}
          />
        </div>
      )*/ }
    </div>
  );
};

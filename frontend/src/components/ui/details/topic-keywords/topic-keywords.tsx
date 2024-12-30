import { useState, FC, ChangeEvent, SyntheticEvent } from 'react';
import { HTMLEditElement, IdeaRaw, KeywordPartial, Keyword } from '../../../../utils/type'
import { KeywordUI } from '../keyword'
import {InputSelectUI} from '../../uni/input-select/input-select'
import styles from './topic-keywords.module.css'


export type TopicKeywordsUIProps = {
    keywordsAll: Keyword[]; // ключевые слова для выбора
    keywordsSelected: KeywordPartial[];
    deleteKeyword: (e: SyntheticEvent, id: number) => void; // удалить ключевое слово к идеи
    addKeyword: (id: number) => void; // добавить ключевое слово к идеи
}

export const TopicKeywordsUI: FC<TopicKeywordsUIProps> = (props) => {
    const [keywordToAdd, setKeywordToAdd] = useState(0);

    function getKeywordName(id: number): string {
        const kw = props.keywordsAll.find(el => el.id === id);
        if (kw)
            return kw.name;
        else
            return '';
    }

    function changeKeywordToAdd(e: ChangeEvent<HTMLEditElement>) {
        const { value, name } = e.target;
        props.addKeyword(Number(value));
        setKeywordToAdd(0);
    }

    return(<div className={styles.keywords_block}>
            {props.keywordsSelected ?
                <div className={styles.keywords}>
                    {props.keywordsSelected.map((kw) =>
                        <KeywordUI 
                            id={kw.id} 
                            name={getKeywordName(kw.id)}
                            deleteKeyword={props.deleteKeyword} />
                    )}
                </div>
            : null
            }

            <InputSelectUI 
                classAdd={styles.input_block}
                name="keyword_id" 
                label="Добавить ключевое слово:" 
                value={keywordToAdd}
                values={props.keywordsAll.filter((el)=> props.keywordsSelected.find((fel)=>fel.id!==el.id))} // только новые
                selectClassAdd={styles['keywords-select']}
                handleChange={changeKeywordToAdd} />
    </div>)
}

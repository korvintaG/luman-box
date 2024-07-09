import { useState, FC, ChangeEvent, SyntheticEvent } from 'react';
import { HTMLEditElement, IdeaEditData, SourceExtension, Keyword } from '../../../utils/type'
import styles from './idea-details.module.css'
import { KeywordUI } from '../keyword/'


export type IdeaDetailsUIProps = {
    id: number | null;
    values: IdeaEditData; // поля идеи для редактирования
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
    handleSubmit: (e: SyntheticEvent) => void; // действие
    deleteIdea: (e: SyntheticEvent) => void; // удалить текущую идею
    deleteKeyword: (e: SyntheticEvent, id: number) => void; // удалить ключевое слово к идеи
    addKeyword: (id: number) => void; // добавить ключевое слово к идеи
    sources: SourceExtension[]; // источники для выбора
    keywords: Keyword[]; // ключевые слова для выбора
    initialName: string; // начальное название идеи для отображения
}

/**
 * Компонент редактирования идеи чистый 
 */
export const IdeaDetailsUI: FC<IdeaDetailsUIProps> = ({ id, values, handleChange, handleSubmit, deleteIdea, sources, keywords, initialName, addKeyword, deleteKeyword }) => {
    const [keywordToAdd, setKeywordToAdd] = useState(0);
    let btnCaptione = 'Сохранить данные';
    let header = 'Добавление новой идеи';
    if (!id)
        btnCaptione = 'Добавить идею';
    else
        header = `Редактирование идеи [${initialName}]`;

    function changeKeywordToAdd(e: ChangeEvent<HTMLSelectElement>) {
        const { value, name } = e.target;
        addKeyword(Number(value));
        setKeywordToAdd(0);
    }

    function getKeywordName(id: number): string {
        const kw = keywords.find(el => el.id === id);
        if (kw)
            return kw.name;
        else
            return '';
    }

    return <main className={styles.main}>
        <h1 className='header_record'>{`${header}`}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputs}>
                <div className={styles.input_block}>
                    <label htmlFor="source_id">Источник идеи:</label>
                    <select value={values.source_id} name="source_id" onChange={handleChange}
                        className={styles.input}>
                        <option value='0'></option>
                        {sources.map((el) =>
                            <option value={el.id} key={el.id}>{el.name + ' // ' + el.authorName}
                            </option>)}
                    </select>
                </div>
                <div className={styles.input_block}>
                    <label htmlFor="name">Название идеи:</label>
                    <input className={styles.input} value={values.name} name="name"
                        placeholder="Укажите название идеи" onChange={handleChange}>
                    </input>
                </div>
            </div>
            <div className={styles.buttons}>
                <button className='button_submit'>{btnCaptione}</button>
                {id && <button className='button_delete' onClick={deleteIdea}>Удалить идею</button>}
            </div>
            <div className={styles.original}>
                <textarea rows={15} value={values.original_text} name="original_text" onChange={handleChange}></textarea>
            </div>
            <div className={styles.content}>
                <textarea rows={15} value={values.content} name="content" onChange={handleChange}></textarea>
            </div>
            <div className={styles.keywords_block}>
                {values.keywords ?
                    <div className={styles.keywords}>
                        {values.keywords.map((kw) =>
                            <KeywordUI id={kw} name={getKeywordName(kw)}
                                deleteKeyword={deleteKeyword} />
                        )}
                    </div>
                    : null
                }
                <div className={styles.input_block}>
                    <label htmlFor="keyword_id">Добавить ключевое слово:</label>
                    <select value={keywordToAdd} name="keyword_id" onChange={changeKeywordToAdd}>
                        <option value='0'></option>
                        {keywords.map((el) =>
                            <option value={el.id} key={el.id}>{el.name}
                            </option>)}
                    </select>
                </div>
            </div>
        </form>
    </main>
}

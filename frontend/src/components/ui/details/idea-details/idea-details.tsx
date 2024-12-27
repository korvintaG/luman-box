import { useState, FC, ChangeEvent, SyntheticEvent } from 'react';
import { HTMLEditElement, IdeaEditData, SourceExtension, Keyword, authorNameFromObj } from '../../../../utils/type'
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import styles from './idea-details.module.css'
import {TopicKeywordsUI} from '../topic-keywords/topic-keywords';
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {InputSelectUI} from '../../uni/input-select/input-select'
import {InputTextUI} from '../../uni/input-text/input-text'


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
export const IdeaDetailsUI: FC<IdeaDetailsUIProps> = (
    { id, values, handleChange, handleSubmit, deleteIdea, sources, keywords, initialName, 
        addKeyword, deleteKeyword }) => {
    const header = id ? `Редактирование идеи [${initialName}]` : 'Добавление новой идеи';
    const btnCaptione = id ? 'Сохранить данные' : 'Добавить идею';

    return <RecordEditUI header={header} onSubmit={handleSubmit} 
                formClass={styles.form} mainClass={styles.main}>
            <div className={styles.inputs}>
                <InputSelectUI classAdd={styles.input_block}
                    name="source_id" label="Источник идеи:" value={values.source.id}
                    selectClassAdd={styles.input}
                    labelClassReplace={styles.label}
                    handleChange={handleChange} 
                    values={sources.map(el =>({id: el.id, name:el.name+'//'+authorNameFromObj(el.author)}))}/>
                <InputEditUI classAdd={styles.input_block}
                    name="name" label='Название идеи:' value={values.name} 
                    placeholder="Укажите название идеи"
                    inputClassAdd={styles.input}
                    labelClassReplace={styles.label}
                    handleChange={handleChange} />
            </div>
            <RecordButtonBlockUI id={id} deleteRecord={deleteIdea} blockClass={styles.buttons}
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить идею' />
            <InputTextUI 
                classAdd={styles.original} 
                value={values.original_text} 
                name="original_text" 
                textClassAdd={styles.original}
                label='Вдохновивший текст'
                handleChange={handleChange}/>
            <InputTextUI 
                classAdd={styles.content} 
                value={values.content} 
                name="content" 
                label='Суть идеи'
                handleChange={handleChange}/>
            <TopicKeywordsUI 
                keywordsAll={keywords}
                keywordsSelected={values.keywords}
                deleteKeyword={deleteKeyword}
                addKeyword={addKeyword}/>
    </RecordEditUI>
}

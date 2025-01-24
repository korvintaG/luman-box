import { FC, ChangeEvent, SyntheticEvent } from 'react';
import { HTMLEditElement, IdeaRaw, Source, Keyword, authorNameFromObj } from '../../../../utils/type'
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import {TopicKeywordsUI} from '../topic-keywords/topic-keywords';
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {InputSelectUI} from '../../uni/input-select/input-select'
import {InputTextUI} from '../../uni/input-text/input-text'
import {genHeaderText} from '../../../../utils/utils' 
import {InfoFieldUI} from '../../uni/info-field/info-field'
import styles from './idea-details.module.css'


export type IdeaDetailsUIProps = {
    id: number | null;
    values: IdeaRaw; // поля идеи для редактирования
    readOnly: boolean;
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
    handleSubmit: (e: SyntheticEvent) => void; // действие
    deleteRecord: (e: SyntheticEvent) => void; // удалить текущую идею
    deleteKeyword: (e: SyntheticEvent, id: number) => void; // удалить ключевое слово к идеи
    addKeyword: (id: number) => void; // добавить ключевое слово к идеи
    sources: Source[]; // источники для выбора
    keywords: Keyword[]; // ключевые слова для выбора
    initialName: string; // начальное название идеи для отображения
    userName: string;    
}

/**
 * Компонент редактирования идеи чистый 
 */
export const IdeaDetailsUI: FC<IdeaDetailsUIProps> = (
    { id, values, handleChange, handleSubmit, deleteRecord, sources, keywords, initialName, 
        readOnly,userName,
        addKeyword, deleteKeyword }) => {
    const header= genHeaderText(readOnly,id,initialName,'идеи','жен'); 
    const btnCaptione = id ? 'Сохранить данные' : 'Добавить идею';
 
    return <RecordEditUI header={header} onSubmit={handleSubmit} 
                formClass={styles.form} mainClass={styles.main}>
            <div className={styles.inputs}>
                <InfoFieldUI label='Запись добавил:' text={userName} 
                    classAdd={styles.input_block}
                    textClassAdd={styles.input}
                    labelClassReplace={styles.label_info}/>
                <InputSelectUI classAdd={styles.input_block}
                    name="source.id" label="Источник идеи:" value={values.source.id}
                    readOnly={readOnly}
                    selectClassAdd={styles.input}
                    labelClassReplace={styles.label}
                    handleChange={handleChange} 
                    values={sources.map(el =>({id: el.id, name:el.name+'//'+authorNameFromObj(el.author)}))}/>
                <InputEditUI classAdd={styles.input_block}
                    name="name" label='Название идеи:' value={values.name} 
                    readOnly={readOnly}
                    placeholder="Укажите название идеи"
                    inputClassAdd={styles.input}
                    labelClassReplace={styles.label}
                    handleChange={handleChange} />
            </div>
            <RecordButtonBlockUI id={id} 
                readOnly={readOnly}
                deleteRecord={deleteRecord} blockClass={styles.buttons}
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить идею' />
            <InputTextUI 
                classAdd={styles.original} 
                value={values.original_text} 
                name="original_text" 
                textClassAdd={styles.original}
                label='Вдохновивший текст'
                readOnly={readOnly}
                handleChange={handleChange}/>
            <InputTextUI 
                classAdd={styles.content} 
                value={values.content} 
                name="content" 
                label='Суть идеи'
                readOnly={readOnly}
                handleChange={handleChange}/>
            <TopicKeywordsUI 
                keywordsAll={keywords}
                keywordsSelected={values.keywords?values.keywords:[]}
                readOnly={readOnly}
                deleteKeyword={deleteKeyword}
        addKeyword={addKeyword}/>
    </RecordEditUI>
}
 
export function IdeaDetailsUIFC (props:IdeaDetailsUIProps) {
    return (
                <IdeaDetailsUI {...props}/>
    ) 
}
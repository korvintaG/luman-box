import { FC, ChangeEvent, SyntheticEvent } from 'react';
import { HTMLEditElement, IdeaRaw, Source, Keyword, authorNameFromObj } from '../../../../utils/type'
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import {TopicKeywordsUI} from '../topic-keywords/topic-keywords';
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {InputSelectUI} from '../../uni/input-select/input-select'
import {InputTextUI} from '../../uni/input-text/input-text'
import {genHeaderText, EditAccessStatus} from '../../../../utils/utils' 
import {InfoFieldUI} from '../../uni/info-field/info-field'
import styles from './idea-details.module.css'


export type IdeaDetailsUIProps = {
    id: number | null;
    values: IdeaRaw; // поля идеи для редактирования
    editAccessStatus: EditAccessStatus;
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
    handleSubmit: (e: SyntheticEvent) => void; // действие
    deleteRecord: (e: SyntheticEvent) => void; // удалить текущую идею
    approveRecord: (e: SyntheticEvent) => void; // одобрить ключевое слово к идеи
    rejectRecord: (e: SyntheticEvent) => void; // отвергнуть ключевое слово к идеи
    deleteKeyword: (e: SyntheticEvent, id: number) => void; // удалить ключевое слово к идеи
    addKeyword: (id: number) => void; // добавить ключевое слово к идеи
    sources: Source[]; // источники для выбора
    keywords: Keyword[]; // ключевые слова для выбора
    initialName: string; // начальное название идеи для отображения
    userName: string;    
    moderatorName?: string | null;
}

/**
 * Компонент редактирования идеи чистый 
 */
export const IdeaDetailsUI: FC<IdeaDetailsUIProps> = (props: IdeaDetailsUIProps) => {
    const header= genHeaderText(props.editAccessStatus===EditAccessStatus.Readonly,props.id,props.initialName,'идеи','жен'); 
    const btnCaptione = props.id ? 'Сохранить данные' : 'Добавить идею';
 
    return <RecordEditUI header={header} onSubmit={props.handleSubmit} 
                formClass={styles.form} mainClass={styles.main}>
            <div className={styles.inputs}>
                <InfoFieldUI label='Запись добавил:' text={props.userName} labelClassAdd={styles.label_info}/>
                {props.moderatorName && <InfoFieldUI labelClassAdd={styles.label_info} label='Проверил:' text={props.moderatorName}/>}
                <InputSelectUI 
                    name="source.id" label="Источник идеи:" value={props.values.source.id}
                    readOnly={props.editAccessStatus===EditAccessStatus.Readonly}
                    handleChange={props.handleChange} 
                    labelClassAdd={styles.label}
                    values={props.sources.map(el =>({id: el.id, name:el.name+'//'+authorNameFromObj(el.author)}))}/>
                <InputEditUI 
                    name="name" label='Название идеи:' value={props.values.name} 
                    readOnly={props.editAccessStatus===EditAccessStatus.Readonly}
                    labelClassAdd={styles.label}
                    placeholder="Укажите название идеи"
                    handleChange={props.handleChange} />
         </div>
         <div className={styles.idea}>
                <InputTextUI 
                    value={props.values.original_text} 
                    name="original_text" 
                    label='Вдохновивший текст'
                    readOnly={props.editAccessStatus===EditAccessStatus.Readonly}
                    classAdd={styles.original} 
                    textClassAdd={styles.original_text}
                    handleChange={props.handleChange}/>
                <InputTextUI 
                    value={props.values.content} 
                    name="content" 
                    label='Суть идеи'
                    readOnly={props.editAccessStatus===EditAccessStatus.Readonly}
                    classAdd={styles.content} 
                    handleChange={props.handleChange}/>
         </div>
         <TopicKeywordsUI 
                keywordsAll={props.keywords}
                keywordsSelected={props.values.keywords?props.values.keywords:[]}
                readOnly={props.editAccessStatus===EditAccessStatus.Readonly}
                deleteKeyword={props.deleteKeyword}
                addKeyword={props.addKeyword}/>
        <RecordButtonBlockUI id={props.id} 
                editAccessStatus={props.editAccessStatus}
                deleteRecord={props.deleteRecord} 
                approveRecord={props.approveRecord} 
                rejectRecord={props.rejectRecord} 
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить идею' />                
    </RecordEditUI>
}
 
//blockClass={styles.buttons}
export function IdeaDetailsUIFC (props:IdeaDetailsUIProps) {
    return (
                <IdeaDetailsUI {...props}/>
    ) 
}
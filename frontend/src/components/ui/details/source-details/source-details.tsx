import { FC, ChangeEvent, SyntheticEvent } from 'react';
import { HTMLEditElement, SourceRaw, Author} from '../../../../utils/type'
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {ErrorMessageUI} from '../../uni/error-message/error-message'
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {InputSelectUI} from '../../uni/input-select/input-select'
import {RelationListUI} from '../../uni/relation-list'
import { appRoutes} from '../../../../AppRoutes'
import styles from './source-details.module.css'
import {genHeaderText} from '../../../../utils/utils' 
import {InfoFieldUI} from '../../uni/info-field/info-field'
import {SourceKeywordsUI} from '../source-keywords/source-keywords'

export type SourceDetailsUIProps = {
    id: number | null;
    readOnly: boolean;
    values: SourceRaw; // карточка исходника
    initialName: string; // исходное название источника
    error?: string;
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // изменение элемента ввода
    handleSubmit: (e: SyntheticEvent) => void; // действия по submit
    deleteRecord: (e: SyntheticEvent) => void; // действия по удалению источника
    authors: Author[]; // список авторов для выбора в лукапе
    userName: string;
}

/**
 * Компонент UI редактирования конкретного источника
 */
export const SourceDetailsUI: FC<SourceDetailsUIProps> = ({id, values, readOnly,
        initialName, error, handleChange, handleSubmit, deleteRecord, authors, userName}) => {
    const header= genHeaderText(readOnly,id,initialName,'источника'); 
    const btnCaptione = id ? 'Сохранить данные' : 'Добавить источник';

    return <RecordEditUI formClass={styles.form} header={header} onSubmit={handleSubmit}>
            <InfoFieldUI labelClassAdd={styles.label_info} label='Запись добавил:' text={userName} />        
            <InputEditUI labelClassAdd={styles.label} name="name" label='Название источника:' value={values.name} 
                placeholder="Укажите название источника"
                inputClassAdd={styles.input}
                classAdd={styles.input_block}
                readOnly={readOnly}
                handleChange={handleChange} />
            <InputSelectUI labelClassAdd={styles.label} name="author.id" label="Выберите автора:" value={values.author?values.author.id:0}
                readOnly={readOnly}
                selectClassAdd={styles.input}
                classAdd={styles.input_block}
                handleChange={handleChange} values={authors}/>
            {error && <ErrorMessageUI error={error}/>}
            <RecordButtonBlockUI id={id} 
                readOnly={readOnly}
                deleteRecord={deleteRecord} 
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить источник' />
            {id && <>
                <RelationListUI 
                    title='Список идей по источнику:'
                    editURLPath={appRoutes.idea}
                    list={values.ideas}/>
                <SourceKeywordsUI
                    title='Список ключевых слов идей по источнику:'
                    source_id={id}
                    keywordsAll={values.keywords}/>
            </>}
    </RecordEditUI> 
}

export function SourceDetailsUIFC (props:SourceDetailsUIProps) {
    return (
                <SourceDetailsUI {...props}/>
    ) 
}
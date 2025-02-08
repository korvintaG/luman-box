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
import {genHeaderText, EditAccessStatus} from '../../../../utils/utils' 
import {InfoFieldUI} from '../../uni/info-field/info-field'
import {SourceKeywordsUI} from '../source-keywords/source-keywords'

export type SourceDetailsUIProps = {
    id: number | null;
    editAccessStatus: EditAccessStatus;
    values: SourceRaw; // карточка исходника
    initialName: string; // исходное название источника
    error?: string;
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // изменение элемента ввода
    handleSubmit: (e: SyntheticEvent) => void; // действия по submit
    deleteRecord: (e: SyntheticEvent) => void; // действия по удалению источника
    moderateRecord: (e: SyntheticEvent) => void; // действия по одобрению источника
    authors: Author[]; // список авторов для выбора в лукапе
    userName: string;
}

/**
 * Компонент UI редактирования конкретного источника
 */
export const SourceDetailsUI: FC<SourceDetailsUIProps> = (props:SourceDetailsUIProps) => {
    const header= genHeaderText(props.editAccessStatus===EditAccessStatus.Readonly,props.id,props.initialName,'источника'); 
    const btnCaptione = props.id ? 'Сохранить данные' : 'Добавить источник';

    return <RecordEditUI formClass={styles.form} header={header} onSubmit={props.handleSubmit}>
            <InfoFieldUI labelClassAdd={styles.label_info} label='Запись добавил:' text={props.userName} />        
            <InputEditUI labelClassAdd={styles.label} name="name" label='Название источника:' value={props.values.name} 
                placeholder="Укажите название источника"
                inputClassAdd={styles.input}
                classAdd={styles.input_block}
                readOnly={props.editAccessStatus===EditAccessStatus.Readonly}
                handleChange={props.handleChange} />
            <InputSelectUI labelClassAdd={styles.label} 
                name="author.id" 
                label="Выберите автора:" 
                value={props.values.author?props.values.author.id:0}
                readOnly={props.editAccessStatus===EditAccessStatus.Readonly}
                selectClassAdd={styles.input}
                classAdd={styles.input_block}
                handleChange={props.handleChange} 
                values={props.authors}/>
            {props.error && <ErrorMessageUI error={props.error}/>}
            <RecordButtonBlockUI id={props.id} 
                editAccessStatus={props.editAccessStatus}
                deleteRecord={props.deleteRecord} 
                moderateRecord={props.moderateRecord} 
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить источник' />
            {props.id && <>
                <RelationListUI 
                    title='Список идей по источнику:'
                    editURLPath={appRoutes.idea}
                    list={props.values.ideas}/>
                <SourceKeywordsUI
                    title='Список ключевых слов идей по источнику:'
                    source_id={props.id}
                    keywordsAll={props.values.keywords}/>
            </>}
    </RecordEditUI> 
}

export function SourceDetailsUIFC (props:SourceDetailsUIProps) {
    return (
                <SourceDetailsUI {...props}/>
    ) 
}
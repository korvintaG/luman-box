import { FC, SyntheticEvent,  ChangeEvent } from 'react';
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import { HTMLEditElement, KeywordRaw } from '../../../../utils/type'
import {genHeaderText, EditAccessStatus} from '../../../../utils/utils' 
import {InfoFieldUI} from '../../uni/info-field/info-field'
import {RelationListUI} from '../../uni/relation-list'
import { appRoutes} from '../../../../AppRoutes'
import styles from './keyword-details.module.css'


export type KeywordDetailsUIProps = {
    id: number | null;
    editAccessStatus: EditAccessStatus;
    values: KeywordRaw; // поля ключевого слова для редактирования
    initialName: string; // начальное имя
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
    handleSubmit: (e: SyntheticEvent) => void;
    deleteRecord: (e: SyntheticEvent) => void;
    approveRecord: (e: SyntheticEvent) => void;
    rejectRecord: (e: SyntheticEvent) => void;
    userName: string;
    moderatorName?: string | null;
}

export const KeywordDetailsUI: FC<KeywordDetailsUIProps> = (props:KeywordDetailsUIProps) => {
    const header= genHeaderText(props.editAccessStatus===EditAccessStatus.Readonly,props.id,props.initialName,'ключевого слова'); 
    const btnCaptione= props.id ? 'Сохранить данные' : 'Добавить ключевое слово';
    
    return <RecordEditUI formClass={styles.form} header={header} onSubmit={props.handleSubmit}>
            <InfoFieldUI labelClassAdd={styles.label_info} label='Запись добавил:' text={props.userName}/>
            {props.moderatorName && <InfoFieldUI labelClassAdd={styles.label_info} label='Проверил:' text={props.moderatorName}/>}
            <InputEditUI labelClassAdd={styles.label} 
                name="name" label='Ключевое слово:' value={props.values.name} 
                placeholder="Введите ключевое слово"
                inputClassAdd={styles.input}
                classAdd={styles.input_block}
                readOnly={props.editAccessStatus===EditAccessStatus.Readonly}
                handleChange={props.handleChange} />
            <RecordButtonBlockUI id={props.id} 
                editAccessStatus={props.editAccessStatus}
                deleteRecord={props.deleteRecord} 
                approveRecord={props.approveRecord} 
                rejectRecord={props.rejectRecord} 
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить ключевое слово' />
            <RelationListUI 
                title='Список авторов, в идеях по источникам которых есть ключевое слово:'
                editURLPath={appRoutes.author}
                list={props.values.authors}
                />
            <RelationListUI 
                title='Список источников, в идеях по которым есть ключевое слово:'
                editURLPath={appRoutes.source}
                list={props.values.sources}
                />
            <RelationListUI 
                title='Список идей, по которым есть ключевое слово:'
                editURLPath={appRoutes.idea}
                list={props.values.ideas}
                />

    </RecordEditUI> 
}

export function KeywordDetailsUIFC (props:KeywordDetailsUIProps) {
    return (
                <KeywordDetailsUI {...props}/>
    ) 
}
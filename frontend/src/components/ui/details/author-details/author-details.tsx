import { FC, SyntheticEvent,  ChangeEvent } from 'react';
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import { HTMLEditElement, AuthorRaw } from '../../../../utils/type'
import { appRoutes} from '../../../../AppRoutes'

import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {genHeaderText} from '../../../../utils/utils' 
import {InfoFieldUI} from '../../uni/info-field/info-field'
import {RelationListUI} from '../../uni/relation-list'
import styles from './author-details.module.css'

/**
 * Чистый компонент редактирования автора
 */
export type AuthorDetailsUIProps = {
    id: number | null;
    values: AuthorRaw; // поля автора для редактирования
    initialName: string; // начальное имя
    readOnly: boolean;
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
    handleSubmit: (e: SyntheticEvent) => void; // сохранить изменения в базе
    deleteRecord: (e: SyntheticEvent) => void; // функция удаления автора
    userName: string;
}

export const AuthorDetailsUI: FC<AuthorDetailsUIProps> = ({id, readOnly,
     values, initialName, handleChange, handleSubmit, deleteRecord, userName}) => {
    const header= genHeaderText(readOnly,id,initialName,'автора'); 
    const btnCaptione = id ? 'Сохранить данные' : 'Добавить автора';
   
    return <RecordEditUI formClass={styles.form}  header={header} onSubmit={handleSubmit}>
            <InfoFieldUI labelClassAdd={styles.label} label='Запись добавил:' text={userName}/>
            <InputEditUI name="name" label='ФИО автора:' value={values.name} 
                labelClassAdd={styles.label}
                inputClassAdd={styles.input}
                classAdd={styles.input_block}
                placeholder="Укажите ФИО автора"
                readOnly={readOnly}
                handleChange={handleChange} />
            <RecordButtonBlockUI 
                id={id} 
                readOnly={readOnly}
                deleteRecord={deleteRecord} 
                submitButtonCaption={btnCaptione} 
                deleteButtonCaption='Удалить автора' />
            <RelationListUI 
                title='Список источников автора:'
                editURLPath={appRoutes.source}
                list={values.sources}
                />
    </RecordEditUI>            
}
 
export function AuthorDetailsUIFC (props:AuthorDetailsUIProps) {
    return (
                <AuthorDetailsUI {...props}/>
    ) 
}
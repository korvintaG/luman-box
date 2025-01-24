import { FC, SyntheticEvent,  ChangeEvent } from 'react';
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import { HTMLEditElement, AuthorRaw } from '../../../../utils/type'
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {genHeaderText} from '../../../../utils/utils' 
import {InfoFieldUI} from '../../uni/info-field/info-field'
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
   
    return <RecordEditUI header={header} onSubmit={handleSubmit}>
            <InfoFieldUI label='Запись добавил:' text={userName}/>
            <InputEditUI name="name" label='ФИО автора' value={values.name} 
                placeholder="Укажите ФИО автора"
                readOnly={readOnly}
                handleChange={handleChange} />
            <RecordButtonBlockUI 
                id={id} 
                readOnly={readOnly}
                deleteRecord={deleteRecord} 
                submitButtonCaption={btnCaptione} 
                deleteButtonCaption='Удалить автора' />
    </RecordEditUI>            
}
 
export function AuthorDetailsUIFC (props:AuthorDetailsUIProps) {
    return (
                <AuthorDetailsUI {...props}/>
    ) 
}
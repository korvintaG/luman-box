import { FC, SyntheticEvent,  ChangeEvent } from 'react';
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import styles from './author-details.module.css'
import { HTMLEditElement, AuthorRaw } from '../../../../utils/type'

import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {ErrorMessageUI} from '../../uni/error-message/error-message'

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
    deleteAuthor: (e: SyntheticEvent) => void; // функция удаления автора
}

export const AuthorDetailsUI: FC<AuthorDetailsUIProps> = ({id, readOnly,
     values, initialName, handleChange, handleSubmit, deleteAuthor}) => {
    const header = id ? `Редактирование автора [${initialName}]` : 'Добавление нового автора';
    const btnCaptione = id ? 'Сохранить данные' : 'Добавить автора';
   
    return <RecordEditUI header={header} onSubmit={handleSubmit}>
            <InputEditUI name="name" label='ФИО автора' value={values.name} 
                placeholder="Укажите ФИО автора"
                readOnly={readOnly}
                handleChange={handleChange} />
            <RecordButtonBlockUI 
                id={id} 
                readOnly={readOnly}
                deleteRecord={deleteAuthor} 
                submitButtonCaption={btnCaptione} 
                deleteButtonCaption='Удалить автора' />
    </RecordEditUI>            

}

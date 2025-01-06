import { FC, SyntheticEvent } from 'react';
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import styles from './author-details.module.css'
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import {ErrorMessageUI} from '../../uni/error-message/error-message'

/**
 * Чистый компонент редактирования автора
 */
export type AuthorDetailsUIProps = {
    id: number | null;
    name: string;
    initialName: string; // начальное имя
    setName: (newName: string) => void; // из useState
    handleSubmit: (e: SyntheticEvent) => void; // сохранить изменения в базе
    deleteAuthor: (e: SyntheticEvent) => void; // функция удаления автора
}

export const AuthorDetailsUI: FC<AuthorDetailsUIProps> = ({id, name, initialName, setName, handleSubmit, deleteAuthor}) => {
    const header = id ? `Редактирование автора [${initialName}]` : 'Добавление нового автора';
    const btnCaptione = id ? 'Сохранить данные' : 'Добавить автора';
   
    return <RecordEditUI header={header} onSubmit={handleSubmit}>
            <InputEditUI name="name" label='ФИО автора' value={name} 
                placeholder="Укажите ФИО автора"
                handleChange={(e) => setName(e.target.value)} />
            <RecordButtonBlockUI 
                id={id} 
                deleteRecord={deleteAuthor} 
                submitButtonCaption={btnCaptione} 
                deleteButtonCaption='Удалить автора' />
    </RecordEditUI>            

}

import { FC, useEffect, SyntheticEvent } from 'react';
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import styles from './keyword-details.module.css'


export type KeywordDetailsUIProps = {
    id: number | null;
    name: string;
    initialName: string; // начальное имя
    error: string;
    setName: (newName: string) => void;
    handleSubmit: (e: SyntheticEvent) => void;
    deleteKeyword: (e: SyntheticEvent) => void;
}

export const KeywordDetailsUI: FC<KeywordDetailsUIProps> = ({id, name, initialName, error, setName, handleSubmit, deleteKeyword}) => {
    const header= id ? `Редактирование ключевого слова [${initialName}]` : 'Добавление нового автора'; 
    const btnCaptione= id ? 'Сохранить данные' : 'Добавить ключевое слово';
    
    return <RecordEditUI header={header} onSubmit={handleSubmit}>
            <InputEditUI name="name" label='Ключевое слово:' value={name} 
                placeholder="Введите ключевое слово"
                handleChange={(e) => setName(e.target.value)} />
            <RecordButtonBlockUI id={id} deleteRecord={deleteKeyword} 
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить ключевое слово' />
    </RecordEditUI> 
}

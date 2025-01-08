import { FC, useEffect, SyntheticEvent,  ChangeEvent } from 'react';
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import { HTMLEditElement, KeywordRaw } from '../../../../utils/type'
import styles from './keyword-details.module.css'


export type KeywordDetailsUIProps = {
    id: number | null;
    values: KeywordRaw; // поля ключевого слова для редактирования
    initialName: string; // начальное имя
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
    handleSubmit: (e: SyntheticEvent) => void;
    deleteKeyword: (e: SyntheticEvent) => void;
}

export const KeywordDetailsUI: FC<KeywordDetailsUIProps> = ({id, values, initialName, handleChange, handleSubmit, deleteKeyword}) => {
    const header= id ? `Редактирование ключевого слова [${initialName}]` : 'Добавление нового автора'; 
    const btnCaptione= id ? 'Сохранить данные' : 'Добавить ключевое слово';
    
    return <RecordEditUI header={header} onSubmit={handleSubmit}>
            <InputEditUI name="name" label='Ключевое слово:' value={values.name} 
                placeholder="Введите ключевое слово"
                handleChange={handleChange} />
            <RecordButtonBlockUI id={id} deleteRecord={deleteKeyword} 
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить ключевое слово' />
    </RecordEditUI> 
}

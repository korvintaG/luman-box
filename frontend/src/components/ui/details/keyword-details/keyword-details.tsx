import { FC, SyntheticEvent,  ChangeEvent } from 'react';
import { RecordEditUI } from '../../uni/record-edit/record-edit'
import {RecordButtonBlockUI} from '../../uni/record-buttons-block/record-buttons-block';
import {InputEditUI} from '../../uni/input-edit/input-edit'
import { HTMLEditElement, KeywordRaw } from '../../../../utils/type'
import {genHeaderText} from '../../../../utils/utils' 
import {InfoFieldUI} from '../../uni/info-field/info-field'
import styles from './keyword-details.module.css'


export type KeywordDetailsUIProps = {
    id: number | null;
    readOnly: boolean;
    values: KeywordRaw; // поля ключевого слова для редактирования
    initialName: string; // начальное имя
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
    handleSubmit: (e: SyntheticEvent) => void;
    deleteRecord: (e: SyntheticEvent) => void;
    userName: string;
}

export const KeywordDetailsUI: FC<KeywordDetailsUIProps> = ({id, values, readOnly,
    initialName, handleChange, handleSubmit, deleteRecord, userName}) => {
    const header= genHeaderText(readOnly,id,initialName,'ключевого слова'); 
    const btnCaptione= id ? 'Сохранить данные' : 'Добавить ключевое слово';
    
    return <RecordEditUI formClass={styles.form} header={header} onSubmit={handleSubmit}>
            <InfoFieldUI labelClassAdd={styles.label_info} label='Запись добавил:' text={userName}/>        
            <InputEditUI labelClassAdd={styles.label} name="name" label='Ключевое слово:' value={values.name} 
                placeholder="Введите ключевое слово"
                inputClassAdd={styles.input}
                classAdd={styles.input_block}
                readOnly={readOnly}
                handleChange={handleChange} />
            <RecordButtonBlockUI id={id} 
                readOnly={readOnly}
                deleteRecord={deleteRecord} 
                submitButtonCaption={btnCaptione} deleteButtonCaption='Удалить ключевое слово' />
    </RecordEditUI> 
}

export function KeywordDetailsUIFC (props:KeywordDetailsUIProps) {
    return (
                <KeywordDetailsUI {...props}/>
    ) 
}
import {FC, SyntheticEvent} from 'react';
import clsx from 'clsx';
import styles from './record-buttons-block.module.css';
import { ButtonAgreeUI } from '../button-type-agree/button-type-agree'
import { ButtonAlertUI } from '../button-type-alert/button-type-alert'
import { ButtonUI } from '../button-type/button-type'
import { useNavigate } from 'react-router-dom';

export type RecordButtonBlockUIProps = {
    id: number | null;
    deleteRecord: (e: SyntheticEvent) => void; // действия по удалению записи
    submitButtonCaption?: string;
    deleteButtonCaption?: string;
    blockClass?: string;
    readOnly:boolean;
}

export const RecordButtonBlockUI: FC<RecordButtonBlockUIProps> = (props) => {
    let saveCaption='Сохранить данные';
    const navigate = useNavigate();
    const back=(e: SyntheticEvent<Element, Event>)=>{
        e.preventDefault();
        navigate(-1)
    }

    if (!props.id)
        saveCaption='Добавить данные'; // className={styles['button-submit']}>
    return <div className={props.blockClass? props.blockClass : styles['button-block']}>
        <ButtonUI caption="Назад" action={back}/>
        {!props.readOnly && <>
            <ButtonAgreeUI 
                caption={props.submitButtonCaption ? props.submitButtonCaption: saveCaption}/>
            {props.id && <ButtonAlertUI 
                caption={props.deleteButtonCaption ? props.deleteButtonCaption: 'Удалить запись'}
                action={props.deleteRecord}/>}
        </>}
    </div>
}
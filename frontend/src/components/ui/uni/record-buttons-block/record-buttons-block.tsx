import {FC, SyntheticEvent} from 'react';
import clsx from 'clsx';
import styles from './record-buttons-block.module.css';
import { ButtonAgreeUI } from '../button-type-agree/button-type-agree'
import { ButtonAlertUI } from '../button-type-alert/button-type-alert'
import { ButtonUI } from '../button-type/button-type'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {EditAccessStatus} from '../../../../utils/utils' 


export type RecordButtonBlockUIProps = {
    id: number | null;
    deleteRecord: (e: SyntheticEvent) => void; // действия по удалению записи
    moderateRecord: (e: SyntheticEvent) => void; // действия по одобрению записи
    submitButtonCaption?: string;
    deleteButtonCaption?: string;
    blockClass?: string;
    editAccessStatus:EditAccessStatus;
}

export const RecordButtonBlockUI: FC<RecordButtonBlockUIProps> = (props) => {
    let saveCaption='Сохранить данные';
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const curBack = searchParams.get('back');

    const back=(e: SyntheticEvent<Element, Event>)=>{

        e.preventDefault();
        navigate(curBack?-curBack:-1)
    }

    if (!props.id)
        saveCaption='Добавить данные'; // className={styles['button-submit']}>
    return <div className={props.blockClass? props.blockClass : styles['button-block']}>
        <ButtonUI caption="Назад" action={back}/>
        {props.editAccessStatus!==EditAccessStatus.Readonly && <>
            <ButtonAgreeUI 
                caption={props.submitButtonCaption ? props.submitButtonCaption: saveCaption}/>
            {props.id && <ButtonAlertUI 
                caption={props.deleteButtonCaption ? props.deleteButtonCaption: 'Удалить запись'}
                action={props.deleteRecord}/>}
            {props.editAccessStatus===EditAccessStatus.Moderatable && <ButtonAgreeUI
                caption='Одобрено'
                action={props.moderateRecord}/>}
        </>}
    </div>
}
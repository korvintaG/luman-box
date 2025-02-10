import {FC, SyntheticEvent} from 'react';
import styles from './moderate-block.module.css';
import { ButtonModerateApproveUI } from '../buttons/button-type-moderate-approve';
import { ButtonModerateRejectUI } from '../buttons/button-type-moderate-reject/button-type-moderate-reject';


export type ModerateBlockUIProps = {
    approveRecord: (e: SyntheticEvent) => void; // действия по одобрению записи
    rejectRecord: (e: SyntheticEvent) => void; // действия по отвержению записи
}

export const ModerateBlockUI: FC<ModerateBlockUIProps> = (props) => {
    return <div className={styles.block}>
        <ButtonModerateApproveUI
                caption='Одобрить'
                action={props.approveRecord}/>
        <ButtonModerateRejectUI
                caption='Отвергнуть'
                action={props.rejectRecord}/>
    </div>
}
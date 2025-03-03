import { FC } from 'react';
import {InfoFieldUI} from '../../uni/info-field/info-field'
import styles from './authorship.module.css'


export type AuthorshipProps = {
        userName:string|null;
        moderatorName:string|null|undefined;
        className:string;
}

export const Authorship: FC<AuthorshipProps> = (props: AuthorshipProps) => {
    if (!props.userName && !props.moderatorName)
        return null;
    return <section className={styles.main}>
        {props.userName && <InfoFieldUI label='Запись добавил:' text={props.userName} labelClassAdd={props.className}/>}
        {props.moderatorName && <InfoFieldUI labelClassAdd={props.className} label='Проверил:' text={props.moderatorName}/>}
    </section>
}
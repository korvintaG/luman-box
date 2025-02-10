import {FC} from 'react';
import clsx from 'clsx';
import { ButtonAddUI } from '../buttons/button-add'
import styles from './record-list.module.css';
import { Preloader } from '../../../../components/ui/uni/preloader';

export type RecordListUIProps = {
    header: string;
    children: React.ReactNode;
    captionAddButton: string;
    addRecord: () => void;
    isLoading: boolean;
    skipUl?: boolean; // не писать UL в начале списка
    liMobileAlteration?:boolean; // чередование полос списка в мобильном варианте
    readOnly?:boolean;
}

export const RecordListUI: FC<RecordListUIProps> = (props: RecordListUIProps) => {
    return <main className={clsx(styles.main,'main',{[styles['main-shrink']]:props.liMobileAlteration})}>
        <h1 className={styles['page-header']}>
            {props.header}
        </h1>
        {props.isLoading ?
                <Preloader />
                :
                <>
                    {props.skipUl ?
                        props.children
                    :
                        <ul className={clsx(styles.list,{[styles['list-mobile-alterarion']]: props.liMobileAlteration})}>
                            {props.children}
                        </ul>
                    }
                    <ButtonAddUI 
                        action={props.addRecord} 
                        disabled={props.readOnly}
                        caption={props.captionAddButton}/>
                </>
        }
    </main>
}    

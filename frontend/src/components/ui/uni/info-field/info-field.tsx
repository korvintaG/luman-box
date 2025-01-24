import { FC, ChangeEvent } from 'react';
import { HTMLEditElement } from '../../../../utils/type'
import { combineClasses } from '../../../../utils/utils'

import styles from './info-field.module.css'

export type InfoFieldUIProps = {
    label: string;
    text: string;
    classReplace?:string;
    classAdd?:string;
    labelClassReplace?: string;
    labelClassAdd?: string;
    textClassAdd?: string;
    textClassReplace?: string;
}

export const InfoFieldUI: FC<InfoFieldUIProps> = (props) => {
    return <div className={combineClasses(styles['info-block'],props.classReplace,props.classAdd)}>
        <label className={combineClasses(styles['info-label'],props.labelClassReplace,props.labelClassAdd)}>
            {props.label}
        </label>
        <div className={combineClasses(styles['info-field'],props.textClassReplace,props.textClassAdd)}>
            {props.text}
        </div>
    </div>
}    

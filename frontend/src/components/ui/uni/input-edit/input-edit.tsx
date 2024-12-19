import { FC, ChangeEvent } from 'react';
import { HTMLEditElement } from '../../../../utils/type'
import { combineClasses } from '../../../../utils/utils'
import styles from './input-edit.module.css'



export type InputEditUIProps = {
    label: string;
    name:string;
    value: string;
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
    placeholder?: string;
    classReplace?:string;
    classAdd?:string;
    labelClassReplace?: string;
    labelClassAdd?: string;
    inputClassReplace?: string;
    inputClassAdd?: string;
}

// clsx({[props.classAdd!]:props.classAdd},styles['input-block'])
// clsx({[props.inputClassAdd!]:props.inputClassAdd},styles['input-edit'])
export const InputEditUI: FC<InputEditUIProps> = (props) => {
    return <div className={combineClasses(styles['input-block'],props.classReplace,props.classAdd)}>
        <label htmlFor={props.name} 
            className={combineClasses(styles['input-label'],props.labelClassReplace,props.labelClassAdd)}>
            {props.label}
        </label>
        <input className={combineClasses(styles['input-edit'],props.inputClassReplace,props.inputClassAdd)}
            value={props.value} name={props.name} placeholder={props.placeholder? props.placeholder :''}
            onChange={props.handleChange}>
        </input>
    </div>
}    

import { FC, ChangeEvent } from 'react';
import { combineClasses } from '../../../../utils/utils'
import { HTMLEditElement } from '../../../../utils/type'
import styles from './input-select.module.css'

export type SelectedValues = {
    id: number;
    name: string;
}

export type InputSelectUIProps = {
    label: string;
    name:string;
    value: number;
    values: SelectedValues[];
    handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
    placeholder?: string;
    classReplace?: string;
    classAdd?: string;
    labelClassReplace?: string;
    labelClassAdd?: string;
    selectClassReplace?: string;
    selectClassAdd?: string;
    hideEmpty?: boolean;
}

export const InputSelectUI: FC<InputSelectUIProps> = (props) => {

    return <div className={combineClasses(styles['input-block'],props.classReplace,props.classAdd)}>
        <label htmlFor={props.name} 
            className={combineClasses(styles['input-label'],props.labelClassReplace,props.labelClassAdd)}>
            {props.label}
        </label>
        <select value={props.value} name={props.name} onChange={props.handleChange}
            className={combineClasses(styles['input-edit'],props.selectClassReplace,props.selectClassAdd)}>
            {props.hideEmpty ? null : <option value='0'></option> }
            {props.values.map((el)=>
                <option className={styles.option} value={el.id} key={el.id}>
                    {el.name}
                </option>
            )}
        </select>
    </div>
}

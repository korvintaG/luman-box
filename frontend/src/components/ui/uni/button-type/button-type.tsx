import { FC, SyntheticEvent} from 'react';
import styles from './button-type.module.css';
import { combineClasses } from '../../../../utils/utils'


export type ButtonUIProps = {
    caption?: string;
    action?: (e:SyntheticEvent) => void;
    disabled?:boolean;
    classReplace?: string;
    classAdd?: string;
        
}

export const ButtonUI: FC<ButtonUIProps> = ({caption, disabled, action, classReplace, classAdd}) => {
    const newCaption=caption?caption:"OK";
    const classes = combineClasses(styles.button,classReplace,classAdd); 
    if (action)
        return <button 
            className={classes} 
            disabled={disabled}
            onClick={action}>
            {newCaption}
        </button>
    else
        return <button 
            type='submit'
            disabled={disabled}
            className={classes}>
            {newCaption}
        </button>
}    

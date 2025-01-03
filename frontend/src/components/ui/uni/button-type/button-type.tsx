import { FC, SyntheticEvent} from 'react';
import styles from './button-type.module.css';
import { combineClasses } from '../../../../utils/utils'


export type ButtonUIProps = {
    caption?: string;
    action?: (e:SyntheticEvent) => void;
    classReplace?: string;
    classAdd?: string;
        
}

export const ButtonUI: FC<ButtonUIProps> = ({caption, action, classReplace, classAdd}) => {
    const newCaption=caption?caption:"OK";
    const classes = combineClasses(styles.button,classReplace,classAdd); 
    if (action)
        return <button 
            className={classes} 
            onClick={action}>
            {newCaption}
        </button>
    else
        return <button 
            type='submit'
            className={classes}>
            {newCaption}
        </button>
}    

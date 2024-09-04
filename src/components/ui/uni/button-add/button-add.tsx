import { FC } from 'react';
import clsx from 'clsx';
import styles from './button-add.module.css';

import { ButtonUIProps } from '../button-type'
import { ButtonAgreeUI } from '../button-type-agree'

export const ButtonAddUI: FC<ButtonUIProps> = (props) => 
    <ButtonAgreeUI
        {...props}
        classAdd={props.classAdd ? 
                    clsx(props.classAdd,styles.button) 
                    : styles.button}
    />
    

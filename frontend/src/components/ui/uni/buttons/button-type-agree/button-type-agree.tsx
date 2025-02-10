import { FC } from 'react';
import clsx from 'clsx';
import styles from './button-type-agree.module.css';

import { ButtonUI, ButtonUIProps } from '../button-type'

export const ButtonAgreeUI: FC<ButtonUIProps> = (props) => 
    <ButtonUI
        {...props}
        classAdd={props.classAdd ? 
                    clsx(props.classAdd,styles.button) 
                    : styles.button}
    />
    

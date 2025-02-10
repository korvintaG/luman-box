import { FC } from 'react';
import clsx from 'clsx';
import styles from './button-type-back.module.css';

import { ButtonUI, ButtonUIProps } from '../button-type'

export const ButtonBackUI: FC<ButtonUIProps> = (props) => 
    <ButtonUI
        {...props}
        classAdd={props.classAdd ? 
                    clsx(props.classAdd,styles.button) 
                    : styles.button}
    />
    

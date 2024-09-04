import { FC } from 'react';
import styles from './error-message.module.css'

export type ErrorMessageUIProps = {
    error: string | null;
}

export const ErrorMessageUI: FC<ErrorMessageUIProps> = ({error}) => {
    if ((!error) || (error ===""))
      return null;
    
    return  <p className={styles.error}>{error}</p>
}

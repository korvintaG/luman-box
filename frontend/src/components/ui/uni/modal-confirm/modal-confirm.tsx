import { FC, SyntheticEvent } from 'react';
import styles from './modal-confirm.module.css';

export type ModalConfirmUIProps={
    question: string;
    action: (e:SyntheticEvent)=>void;
    closeAction: ()=>void;
}

export const ModalConfirmUI: FC<ModalConfirmUIProps> =  (props) => (
      <>
        <div className={styles.modal} >
          <div> 
            <h3>
              Запрос
            </h3>
            <button
              className={styles.button}
              type='button'
              onClick={(e:SyntheticEvent)=>{props.closeAction()}}
            >
               X 
            </button>
          </div>
          <div className={styles.content}>
            <p>{props.question}</p>
            <button onClick={(e:SyntheticEvent)=> {
                props.closeAction();
                props.action(e);
                }}>
                Да</button>
            <button onClick={(e:SyntheticEvent)=>{props.closeAction()}}>
                Нет
            </button>
          </div>
        </div>
      </>
    )
  
  
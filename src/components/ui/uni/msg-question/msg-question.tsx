import Modal from 'react-modal'
import { FC, SyntheticEvent  } from 'react';
import { ButtonAgreeUI } from '../button-type-agree'
import { ButtonAlertUI } from '../button-type-alert'
import { ReactComponent as CloseIcon } from "./close-icon.svg";
import styles from './msg-question.module.css';

export type MsgQuestionUIProps={
    question: string;
    action: (e:SyntheticEvent)=>void;
    closeAction: ()=>void;
    yesIsAlert?: boolean;
}

const components = {
    agree: ButtonAgreeUI,
    alert: ButtonAlertUI
};

export const MsgQuestionUI: FC<MsgQuestionUIProps> =  (props) => {
    let YesBtnComp=components.agree;
    let NoBtnComp=components.alert;
    if (props.yesIsAlert) {
        YesBtnComp=components.alert;
        NoBtnComp=components.agree;
    }

    const yesAction=(e:SyntheticEvent) => {
        props.action(e);
        props.closeAction();
    }

    const noAction=(e:SyntheticEvent) => {
        props.closeAction();
    }

    return (    
    <Modal 
        isOpen={true}
        ariaHideApp={false}
        preventScroll={false}
        style={{overlay: {},
            content: {
                maxWidth: 500, 
                height: "min-content", 
                margin: 'auto'}
            }}    
        onRequestClose={props.closeAction}>
        <button className={styles["close-button"]} onClick={noAction}>
            <CloseIcon />
        </button>            
        <p className={styles.question}>{props.question}</p>
        <div className={styles.buttons}>
            <YesBtnComp 
                action={yesAction}
                caption='Да'/>
            <NoBtnComp 
                action={noAction}
                caption='Нет'/>
        </div>
   </Modal>)
}
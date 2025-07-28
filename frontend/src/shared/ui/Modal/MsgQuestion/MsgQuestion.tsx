import Modal from "react-modal";
import { FC, SyntheticEvent } from "react";
import { ButtonUI, LogicButtonType } from "../../button"; 
import { ReactComponent as CloseIcon } from "../../../../assets/images/close-icon.svg";
import styles from "./MsgQuestion.module.css";

export type MsgQuestionUIProps = {
  question: string;
  action: (e: SyntheticEvent) => void;
  closeAction: () => void;
  yesIsAlert?: boolean;
};

export const MsgQuestionUI: FC<MsgQuestionUIProps> = (props) => {
  let yesLogicType: LogicButtonType = "agree";
  let noLogicType: LogicButtonType = "alert";
  
  if (props.yesIsAlert) {
    yesLogicType = "alert";
    noLogicType = "agree";
  }

  const yesAction = (e: SyntheticEvent) => {
    props.action(e);
    props.closeAction();
  };

  const noAction = (e: SyntheticEvent) => {
    props.closeAction();
  };

  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      preventScroll={false}
      style={{
        overlay: {zIndex: 222},
        content: {
          maxWidth: 500,
          height: "min-content",
          margin: "auto",
        },
      }}
      onRequestClose={props.closeAction}
    >
      <button className={styles["close-button"]} onClick={noAction}>
        <CloseIcon />
      </button>
      <p className={styles.question}>{props.question}</p>
      <div className={styles.buttons}>
        <ButtonUI logicType={yesLogicType} onClick={yesAction} caption="Да" />
        <ButtonUI logicType={noLogicType} onClick={noAction} caption="Нет" />
      </div>
    </Modal>
  );
};

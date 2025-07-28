import Modal from "react-modal";
import { FC, SyntheticEvent } from "react";
import { ReactComponent as CloseIcon } from "../../../../assets/images/close-icon.svg";
import styles from "./MsgErrorModal.module.css";
import { ButtonUI } from "../../button";

export type MsgErrorModalUIProps = {
  message: string;
  closeAction: () => void;
};

export const MsgErrorModalUI: FC<MsgErrorModalUIProps> = (props) => {
  const yesAction = (e: SyntheticEvent) => {
    props.closeAction();
  };


  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      preventScroll={false}
      style={{
        overlay: {zIndex: 999},
        content: {
          maxWidth: 500,
          height: "min-content",
          margin: "auto",
        },
      }}
      onRequestClose={props.closeAction}
    >
      <button className={styles["close-button"]} onClick={props.closeAction}>
        <CloseIcon />
      </button>
      <p className={styles.error}>{props.message}</p>
      <div className={styles.buttons}>
        <ButtonUI logicType="alert" onClick={yesAction} caption="OK" />
      </div>
    </Modal>
  );
};

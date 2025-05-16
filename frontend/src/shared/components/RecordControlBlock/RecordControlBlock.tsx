import { FC, SyntheticEvent, useEffect } from "react";
import styles from "./RecordControlBlock.module.css";
import { ButtonAgreeUI } from "../../ui/buttons/button-type-agree"; 
import { ButtonAlertUI } from "../../ui/buttons/button-type-alert";
import { ButtonBackUI } from "../../ui/buttons/button-type-back";
import { useNavigate } from "react-router-dom";
import { EditAccessStatus, getErrorTypeBySlice, isDMLRequestFailed, isDMLRequestOK } from "../../utils/utils";
import { useMsgModal } from "../../hooks/useMsgModal";
import { MsgQuestionUI } from "../../ui/Modal/MsgQuestion";
import { RequestStatusValue } from "../../common-types";
import { MsgErrorModalUI } from "../../ui/Modal/MsgErrorModal/MsgErrorModal";
import { ModerateBlockUI } from "../ModerateBlock/ModerateBlock";

export type RecordControlBlockProps = {
  editAccessStatus: EditAccessStatus;
  deleteRecord?: (e: SyntheticEvent) => void; // действия по удалению записи
  afterSuccessDMLAction: () => void;
  //handleSubmit: (e: SyntheticEvent) => void;
  sliceState: RequestStatusValue;
  error: string;
  approveRecord: (e: SyntheticEvent) => void; // действия по одобрению записи
  rejectRecord: (e: SyntheticEvent) => void; // действия по отвержению записи
  blockClass?: string;
  id?: string;
  saveButtonCaption?:string;
};

export const RecordControlBlock: FC<RecordControlBlockProps> = (props) => {
  const msgDeleteHook = useMsgModal();
  const msgErrorHook = useMsgModal();
  const navigate = useNavigate();
  let saveCaption = props.saveButtonCaption ? 
    props.saveButtonCaption :
    (props.id ? "Сохранить данные" : "Добавить данные");

  useEffect(() => {
    if (isDMLRequestOK(props.sliceState)) props.afterSuccessDMLAction();
  }, [props.sliceState]);


  useEffect(() => {
    if (isDMLRequestFailed(props.sliceState)) 
      msgErrorHook.openDialogDirectly();
  }, [props.sliceState]);

  const back = (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      {props.deleteRecord &&  msgDeleteHook.dialogWasOpened && (
        <MsgQuestionUI yesIsAlert
          question="Удалить запись?"
          closeAction={msgDeleteHook.closeDialog}
          action={props.deleteRecord} />
      )}
      {msgErrorHook.dialogWasOpened && (
        <MsgErrorModalUI
          message={`${getErrorTypeBySlice(props.sliceState)} ${props.error}`}
          closeAction={msgErrorHook.closeDialog}
        />
      )}

      <div
        className={props.blockClass ? props.blockClass : styles["button-block"]}
      >
      <ButtonBackUI caption="Назад" action={back} />
      {props.editAccessStatus !== EditAccessStatus.Readonly && <>
        <ButtonAgreeUI caption={saveCaption} />
        {props.id && <ButtonAlertUI
            caption={
              "Удалить запись"
            }
            action={msgDeleteHook.openDialog}
          />}
          </>}
      </div>
      {props.editAccessStatus === EditAccessStatus.Moderatable && (
        <ModerateBlockUI
          approveRecord={props.approveRecord}
          rejectRecord={props.rejectRecord}
        />
      )}
    </div>
  );
};

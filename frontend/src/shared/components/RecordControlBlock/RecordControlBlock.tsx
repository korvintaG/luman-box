import { FC, SyntheticEvent, useEffect } from "react";
import styles from "./RecordControlBlock.module.css";
import { ButtonUI } from "../../ui/button";
import { useLocation, useNavigate, Route } from "react-router-dom";
import {
  EditAccessStatus,
  getErrorTypeBySlice,
  isDMLRequestFailed,
  isDMLRequestOK,
} from "../../utils/utils";
import { useMsgModal } from "../../hooks/useMsgModal";
import { MsgQuestionUI } from "../../ui/Modal/MsgQuestion";
import { RequestStatusValue } from "../../common-types";
import { MsgErrorModalUI } from "../../ui/Modal/MsgErrorModal/MsgErrorModal";
import { ModerateBlockUI } from "../ModerateBlock/ModerateBlock";

export type RecordControlBlockProps = {
  editAccessStatus?: EditAccessStatus;
  deleteRecord?: (e: SyntheticEvent) => void; // действия по удалению записи
  afterSuccessDMLAction: () => void;
  resetSliceState?: () => void;
  //handleSubmit: (e: SyntheticEvent) => void;
  sliceState: RequestStatusValue;
  preparedSliceState?: RequestStatusValue;
  error: string;
  approveRecord?: (e: SyntheticEvent) => void; // действия по одобрению записи
  rejectRecord?: (e: SyntheticEvent) => void; // действия по отвержению записи
  blockClass?: string;
  id?: string;
  saveButtonCaption?: string;
};

export const RecordControlBlock: FC<RecordControlBlockProps> = (props) => {
  const msgDeleteHook = useMsgModal();
  const msgErrorHook = useMsgModal();
  const navigate = useNavigate();
  const location = useLocation();
  let saveCaption = props.saveButtonCaption
    ? props.saveButtonCaption
    : props.id
      ? "Сохранить данные"
      : "Добавить данные";

  useEffect(() => {
    if (isDMLRequestOK(props.sliceState)) props.afterSuccessDMLAction();
  }, [props.sliceState]);

  useEffect(() => {
    if (
      isDMLRequestFailed(props.sliceState) ||
      (props.preparedSliceState && isDMLRequestFailed(props.preparedSliceState))
    )
      msgErrorHook.openDialogDirectly();
  }, [props.sliceState, props.preparedSliceState]);

  const back = (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    //window.history.go(-1);
    navigate(-1);
    //console.log(window.history)
  };

  const errorCloseAction = () => {
    if (props.resetSliceState) props.resetSliceState();
    msgErrorHook.closeDialog();
  };

  return (
    <div className={styles.container}>
      {props.deleteRecord && msgDeleteHook.dialogWasOpened && (
        <MsgQuestionUI
          yesIsAlert
          question="Удалить запись?"
          closeAction={msgDeleteHook.closeDialog}
          action={props.deleteRecord}
        />
      )}
      {msgErrorHook.dialogWasOpened && (
        <MsgErrorModalUI
          message={`${getErrorTypeBySlice(props.sliceState)} ${props.error}`}
          closeAction={errorCloseAction}
        />
      )}

      <div
        className={props.blockClass ? props.blockClass : styles["button-block"]}
      >
        <ButtonUI logicType="back" onClick={back} caption="Назад" />
        {props.editAccessStatus !== EditAccessStatus.Readonly && (
          <>
            <ButtonUI logicType="agree" caption={saveCaption} />
            {props.id && (
              <ButtonUI
                logicType="alert"
                caption={"Удалить запись"}
                onClick={msgDeleteHook.openDialog}
              />
            )}
          </>
        )}
      </div>
      {props.editAccessStatus === EditAccessStatus.Moderatable &&
        props.approveRecord &&
        props.rejectRecord && (
          <ModerateBlockUI
            approveRecord={props.approveRecord}
            rejectRecord={props.rejectRecord}
          />
        )}
    </div>
  );
};

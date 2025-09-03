import { SyntheticEvent, useEffect } from "react";
import styles from "../styles/RecordControlBlock.module.css";
import { ButtonUI } from "../../../ui/button";
import { useNavigate } from "react-router-dom";
import {
  EditAccessStatus,
  getErrorTypeBySlice,
  isDMLRequestFailed,
} from "../../../utils/utils";
import { useMsgModal } from "../../../hooks/useMsgModal";
import { MsgQuestionUI } from "../../../ui/Modal/MsgQuestion";
import { MsgErrorModalUI } from "../../../ui/Modal/MsgErrorModal/MsgErrorModal";
import { ModerateBlockUI } from "../../ModerateBlock/ModerateBlock";
import { RecordControlBlockProps } from "../types/types";
import { RequestStatus } from "../../../types/types-for-hooks";

export function RecordControlBlock<T>(
  props: RecordControlBlockProps<T>
): JSX.Element {
  const msgDeleteHook = useMsgModal();
  const msgErrorHook = useMsgModal();
  const msgPublishHook = useMsgModal();
  const navigate = useNavigate();
  //const location = useLocation();
  const { form, status, record, moderate } = props.entityDetailsHook;

  let saveCaption = props.entityDetailsHook.record.id
    ? "Сохранить данные"
    : "Добавить данные";


  useEffect(() => {
    console.log('RecordControlBlock useEffect', status.sliceStates[0]);
    if (status.sliceStates[0] === RequestStatus.Added) {
      if (record.newID) {
        props.gotoEntityEdit(record.newID); //navigate to new author details page
      }
    }
    else if (status.sliceStates[0] === RequestStatus.Updated && record.fetchRecord) {
      record.fetchRecord();
      //props.resetEditStarted();
    }
    else if (status.sliceStates[0] === RequestStatus.SendToModerating) props.gotoEntityList();
    else if (status.sliceStates[0] === RequestStatus.Deleted) {
      props.gotoEntityList();
    }
  }, [status.sliceStates[0]]);

  useEffect(() => {
    if (
      isDMLRequestFailed(status.sliceStates[0]) ||
      (status.sliceStates[1] && isDMLRequestFailed(status.sliceStates[1]))
    )
      msgErrorHook.openDialogDirectly();
  }, [status.sliceStates[0], status.sliceStates[1]]);

  const back = (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    if (props.gotoEntityList)
      props.gotoEntityList();
    else
      navigate(-1);
  };

  const errorCloseAction = () => {
    if (status.resetSlicesStatus) status.resetSlicesStatus();
    msgErrorHook.closeDialog();
  };

  return <div className={styles.container}>
    {msgDeleteHook.dialogWasOpened && (
      <MsgQuestionUI
        yesIsAlert
        question="Удалить запись?"
        closeAction={msgDeleteHook.closeDialog}
        action={record.deleteRecordAction}
      />
    )}
    {msgPublishHook.dialogWasOpened && (
      <MsgQuestionUI
        question="Опубликовать информацию?"
        closeAction={msgPublishHook.closeDialog}
        action={moderate.toModerateRecordAction}
      />
    )}
    {msgErrorHook.dialogWasOpened && (
      <MsgErrorModalUI
        message={`${getErrorTypeBySlice(status.sliceStates[0])} ${status.errorText}`}
        closeAction={errorCloseAction}
      />
    )}

    <div
      className={styles["button-block"]}
    >
      <ButtonUI logicType="back" onClick={back} caption="Назад" />
      {status.editAccessStatus &&
        [EditAccessStatus.Editable,
        EditAccessStatus.EditableAndModeratable,
        EditAccessStatus.EditableAndPublishable].includes(status.editAccessStatus) && (
          <>
            <ButtonUI
              disabled={!form.editStarted}
              logicType="agree"
              caption={saveCaption} />
            {props.entityDetailsHook.record && props.entityDetailsHook.record.id && (
              <ButtonUI
                logicType="alert"
                caption={"Удалить запись"}
                onClick={msgDeleteHook.openDialog}
              />
            )}
          </>
        )}

      {status.editAccessStatus &&
        status.editAccessStatus === EditAccessStatus.EditableAndPublishable && (
          <ButtonUI
            disabled={form.editStarted}
            logicType="publish"
            caption="Опубликовать"
            onClick={msgPublishHook.openDialog}
          />
        )}
    </div>

    {status.editAccessStatus &&
      [EditAccessStatus.Moderatable, EditAccessStatus.EditableAndModeratable].includes(status.editAccessStatus) &&
      moderate.approveRecordAction &&
      moderate.rejectRecordAction && (
        <ModerateBlockUI
          approveRecord={moderate.approveRecordAction}
          rejectRecord={moderate.rejectRecordAction}
          moderateNotes={form.values.moderation_notes}
          setModerateNotes={(notes: string) => form.setValues({ ...form.values, moderation_notes: notes })}
        />
      )}

  </div>
}
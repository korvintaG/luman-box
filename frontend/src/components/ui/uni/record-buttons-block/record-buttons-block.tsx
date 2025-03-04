import { FC, SyntheticEvent } from "react";
import styles from "./record-buttons-block.module.css";
import { ButtonAgreeUI } from "../buttons/button-type-agree/button-type-agree";
import { ButtonAlertUI } from "../buttons/button-type-alert/button-type-alert";
import { ButtonBackUI } from "../buttons/button-type-back/button-type-back";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EditAccessStatus } from "../../../../utils/utils";
import { ModerateBlockUI } from "../moderate-block/moderate-block";

export type RecordButtonBlockUIProps = {
  id: number | null;
  deleteRecord: (e: SyntheticEvent) => void; // действия по удалению записи
  approveRecord: (e: SyntheticEvent) => void; // действия по одобрению записи
  rejectRecord: (e: SyntheticEvent) => void; // действия по отверганию записи
  submitButtonCaption?: string;
  deleteButtonCaption?: string;
  blockClass?: string;
  editAccessStatus: EditAccessStatus;
};

export const RecordButtonBlockUI: FC<RecordButtonBlockUIProps> = (props) => {
  let saveCaption = "Сохранить данные";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const curBack = searchParams.get("back");

  const back = (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    navigate(curBack ? -curBack : -1);
  };

  if (!props.id) saveCaption = "Добавить данные"; // className={styles['button-submit']}>
  return (
    <>
      <div
        className={props.blockClass ? props.blockClass : styles["button-block"]}
      >
        <ButtonBackUI caption="Назад" action={back} />
        {props.editAccessStatus !== EditAccessStatus.Readonly && (
          <>
            <ButtonAgreeUI
              caption={
                props.submitButtonCaption
                  ? props.submitButtonCaption
                  : saveCaption
              }
            />
            {props.id && (
              <ButtonAlertUI
                caption={
                  props.deleteButtonCaption
                    ? props.deleteButtonCaption
                    : "Удалить запись"
                }
                action={props.deleteRecord}
              />
            )}
          </>
        )}
      </div>
      {props.editAccessStatus === EditAccessStatus.Moderatable && (
        <ModerateBlockUI
          approveRecord={props.approveRecord}
          rejectRecord={props.rejectRecord}
        />
      )}
    </>
  );
};

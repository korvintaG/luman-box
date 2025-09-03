import { FC } from "react";
import { InfoFieldType, InfoFieldUI } from "../../../ui/fields/info-field/info-field"; 
import styles from "../styles/Authorship.module.css";
import { IAuthorshipProps, IAuthorshipRecord } from "../types/types";
import { formatMoscowDateTime } from "../../../utils/utils";
import { VerificationStatus, VerificationStatusClass, VerificationStatusLabels } from "../../../types/entity-types";
import clsx from "clsx";


export const Authorship: FC<IAuthorshipProps<IAuthorshipRecord>> = (props) => {
  if (!props.record.user) return null;

  const infoType=(verification_status: VerificationStatus): InfoFieldType =>{
    switch(verification_status){
      case VerificationStatus.Creating:
        return "info";
      case VerificationStatus.ToModerate:
        return "processing";
      case VerificationStatus.Moderated:
        return "success";
      case VerificationStatus.Rejected:
        return "error";
    }
    return "info";
  }

  return (
    <>
    {props.record.verification_status!==null && <InfoFieldUI
          label="Статус:"
          text={VerificationStatusLabels[props.record.verification_status]}
          type={infoType(props.record.verification_status)}
        />
    }
    {props.record.verification_status!==null && props.record.moderation_notes && (
        <InfoFieldUI
          label="Замечание:"
          text={props.record.moderation_notes}
          type={infoType(props.record.verification_status)}
        />
    )}
    {props.record.date_time_create && (
        <InfoFieldUI
          label="Создано:"
          text={formatMoscowDateTime(props.record.date_time_create)}
        />
      )}
      {props.record.user && (
        <InfoFieldUI
          label={(props.entityName?props.entityName:"Запись")+" добавил:"}
          text={props.record.user.name}
        />
      )}
     
      {props.record.date_time_to_moderate && (
        <InfoFieldUI
          label="На модерацию с:"
          text={formatMoscowDateTime(props.record.date_time_to_moderate)}
        />
      )}
      {props.record.moderator && (
        <InfoFieldUI
          label="Проверил:"
          text={props.record.moderator.name}
        />
      )}
      {props.record.date_time_moderated && (
        <InfoFieldUI
          label="Модерировано:"
          text={formatMoscowDateTime(props.record.date_time_moderated)}
        />
      )}
    </>
  );
};

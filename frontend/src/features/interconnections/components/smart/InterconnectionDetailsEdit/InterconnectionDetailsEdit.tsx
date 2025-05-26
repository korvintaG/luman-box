import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { ErrorMessageUI } from "../../../../../shared/ui/ErrorMessage/ErrorMessage";
import { interconnectionsTypeInfo } from "../../../../../shared/constants/InterconnectionTypeInfo";
import { User } from "../../../../auth/user-types";
import { useInterconnectionDetailsEdit } from "../../../hooks/UseInterconnectionDetailsEdit";
import { RecordEditForm } from "../../../../../shared/components/RecordEditForm/RecordEditForm";
import { InterconnectionTypeInfo } from "../../../InterconnectionTypes";
import { RecordControlBlock } from "../../../../../shared/components/RecordControlBlock/RecordControlBlock";
import styles from "./InterconnectionDetailsEdit.module.css";
import { IdeaCard } from "../../ui/ideaCard/ideaCard";
import { InterconnectionDescription } from "../../ui/InterconnectionDescription/InterconnectionDescription";
import { FillRecomendation } from "../../ui/FillRecomendation/FillRecomendation";
import { InterconnectionDetailsTitle } from "../../ui/InterconnectionDetailsTitle/InterconnectionDetailsTitle";
import { Authorship } from "../../../../../shared/components/Authorship/Authorship";
import { EditAccessStatus } from "../../../../../shared/utils/utils";
import { BreadcrumbSimpeType } from "../../../../../shared/components/Breadcrumbs/Breadcrumbs";

export type InterconnectionDetailsEditProp = {
  id?: string;
  currentUser: User | null;
  afterSuccessDMLAction: (idea_id: number, iitype_id: number) => void;
  isReverse: boolean;
};

export const InterconnectionDetailsEdit: FC<InterconnectionDetailsEditProp> = ({
  id,
  currentUser,
  afterSuccessDMLAction,
  isReverse,
}) => {
  const { form, status, record, moderate } = useInterconnectionDetailsEdit({
    id,
    currentUser,
  });

  let iitype: InterconnectionTypeInfo | undefined = undefined;
  if (record && record.currentRecord) {
    iitype = interconnectionsTypeInfo.find(
      (el) => el.id === record!.currentRecord!.interconnection_type
    );
    if (!iitype)
      return (
        <ErrorMessageUI
          error={`Не найден тип связи идей=${record!.currentRecord!.id}`}
        />
      );
  }

  const tabHeader = `Взаимосвязи идеи [${record.currentRecord?.ideaCurrent?.name}] с [${record.currentRecord?.ideaInterconnect?.name}] типа: ${iitype?.name}`;

  return (
    <>
      <Helmet>
        <title>{tabHeader}</title>
      </Helmet>

      <RecordEditForm
        breadcrumbs={[BreadcrumbSimpeType.IdeasList]}
        onSubmit={record.handleSubmitAction}
        sliceState={status.sliceStates}
        error={status.errorText}
        header={`${status.editAccessStatus !== EditAccessStatus.Readonly ? "Редактирование " : "Просмотр "}
        взаимосвязи между идеями типа [${iitype?.name}]`}
        fetchRecord={record.fetchRecord}
      >
        {/*<InterconnectionDetailsTitle typeName={iitype?.name} />*/}
        {record.currentRecord && record.currentRecord.user && (
          <Authorship
            userName={record.currentRecord.user.name}
            moderatorName={
              record.currentRecord.moderator
                ? record.currentRecord.moderator.name
                : null
            }
            className={styles.authorship}
            label="Взаимосвязь"
          />
        )}
        {record.currentRecord && record.currentRecord.ideaCurrent && (
          <div className={styles.idea_top}>
            <IdeaCard
              idea={record.currentRecord.ideaCurrent}
              ideaTypeInfo={iitype?.name1_one}
            />
          </div>
        )}
        <InterconnectionDescription
          nameDirect={form.values.nameDirect}
          nameReverse={form.values.nameReverse}
          handleChange={form.handleChange}
          ideaTypeInfo={iitype}
          readOnly={status.editAccessStatus === EditAccessStatus.Readonly}
        />

        {record.currentRecord && record.currentRecord.ideaInterconnect && (
          <div className={styles.idea_bottom}>
            <IdeaCard
              idea={record.currentRecord.ideaInterconnect}
              ideaTypeInfo={iitype?.name2_one}
            />
          </div>
        )}
        {status.editAccessStatus === EditAccessStatus.Editable && (
          <FillRecomendation />
        )}
        <RecordControlBlock
          id={id}
          sliceState={status.sliceStates[0]}
          error={status.errorText}
          editAccessStatus={status.editAccessStatus}
          deleteRecord={record.deleteRecordAction}
          afterSuccessDMLAction={() => {
            afterSuccessDMLAction(
              isReverse
                ? record!.currentRecord!.idea2_id
                : record!.currentRecord!.idea1_id,
              record!.currentRecord!.interconnection_type
            );
          }}
          approveRecord={moderate.approveRecordAction}
          rejectRecord={moderate.rejectRecordAction}
        />
      </RecordEditForm>
    </>
  );
};

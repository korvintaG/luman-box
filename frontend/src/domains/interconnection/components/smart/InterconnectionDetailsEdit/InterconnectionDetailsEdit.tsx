import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { ErrorMessageUI } from "../../../../../shared/ui/ErrorMessage/ErrorMessage";
import { interconnectionsTypeInfo } from "../../../../../shared/constants/InterconnectionTypeInfo";
import { useInterconnectionDetailsEdit } from "../../../hooks/UseInterconnectionDetailsEdit";
import { RecordEditForm } from "../../../../../shared/components/RecordEditForm/RecordEditForm";
import { InterconnectionTypeInfo } from "../../../types/UI-types";
import { RecordControlBlock } from "../../../../../shared/components/record-control-block/ui/record-control-block";
import styles from "./InterconnectionDetailsEdit.module.css";
import { IdeaCard } from "../../ui/ideaCard/ideaCard";
import { InterconnectionDescription } from "../../ui/InterconnectionDescription/InterconnectionDescription";
import { FillRecomendation } from "../../ui/FillRecomendation/FillRecomendation";
import { Authorship } from "../../../../../shared/components/Authorship/ui/Authorship";
import { EditAccessStatus } from "../../../../../shared/utils/utils";
import { BreadcrumbSimpeType } from "../../../../../shared/components/Breadcrumbs/Breadcrumbs";

export type InterconnectionDetailsEditProp = {
  //id?: string;
  //currentUser: User | null;
  gotoList: () => void;
  gotoEdit: (id: number) => void;
  //isReverse: boolean;
  interconnectionDetailsHook: ReturnType<typeof useInterconnectionDetailsEdit>;
};

export const InterconnectionDetailsEdit: FC<InterconnectionDetailsEditProp> = ({
  interconnectionDetailsHook,
  gotoList,
  gotoEdit,
  //isReverse,
}) => {
  const { form, status, record, moderate } = interconnectionDetailsHook;
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

  const tabHeader = `Взаимосвязи идеи [${record.currentRecord?.idea_current?.name}] с [${record.currentRecord?.idea_interconnect?.name}] типа: ${iitype?.name}`;

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
          <div className={styles.authorship}>
            <Authorship
              record={record.currentRecord}
              entityName="Взаимосвязь"
            />
          </div>
        )}
        {record.currentRecord && record.currentRecord.idea_current && (
          <div className={styles.idea_top}>
            <IdeaCard
              idea={record.currentRecord.idea_current}
              ideaTypeInfo={iitype?.name1_one}
            />
          </div>
        )}
        <InterconnectionDescription
          nameDirect={form?.values.name_direct ?? ""}
          nameReverse={form?.values.name_reverse ?? ""}
          handleChange={form?.handleChange ?? (() => {})}
          ideaTypeInfo={iitype}
          readOnly={status.editAccessStatus === EditAccessStatus.Readonly}
        />

        {record.currentRecord && record.currentRecord.idea_interconnect && (
          <div className={styles.idea_bottom}>
            <IdeaCard
              idea={record.currentRecord.idea_interconnect}
              ideaTypeInfo={iitype?.name2_one}
            />
          </div>
        )}
        {status.editAccessStatus === EditAccessStatus.Editable && (
          <FillRecomendation />
        )}
        <RecordControlBlock 
          gotoEntityEdit={gotoEdit}
          entityDetailsHook={interconnectionDetailsHook}
          gotoEntityList={gotoList}
        
        />
      </RecordEditForm>
    </>
  );
};

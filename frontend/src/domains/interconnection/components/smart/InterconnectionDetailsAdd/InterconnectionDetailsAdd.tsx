import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { User } from "../../../../../features/auth/user-types";
import { InterconnectionTypeInfo } from "../../../types/UI-types";
import { useInterconnectionDetailsAdd } from "../../../hooks/UseInterconnectionDetailsAdd";
import { RecordEditForm } from "../../../../../shared/components/RecordEditForm/RecordEditForm";
import { IdeaCard } from "../../ui/ideaCard/ideaCard";
import { InterconnectionDescription } from "../../ui/InterconnectionDescription/InterconnectionDescription";
import { IdeaSelect } from "../../ui/IdeaSelect/IdeaSelect";
import { RecordControlBlock } from "../../../../../shared/components/record-control-block/ui/record-control-block";
import { FillRecomendation } from "../../ui/FillRecomendation/FillRecomendation";
import styles from "./InterconnectionDetailsAdd.module.css";
import { BreadcrumbSimpeType } from "../../../../../shared/components/Breadcrumbs/Breadcrumbs";
import { convertAddToEditHook } from "../../../../../shared/utils/utils";
import { genInterconnectionURL } from "../../../../../app/router/navigation";

export type InterconnectionDetailsAddProp = {
  idea_id: string;
  iitype_id: string;
  currentUser: User | null;
  gotoList: () => void;
  gotoEdit: (id: number) => void;
  isReverse: boolean;
  interconnectionTypeInfo: InterconnectionTypeInfo;
};

export const InterconnectionDetailsAdd: FC<InterconnectionDetailsAddProp> = ({
  idea_id,
  iitype_id,
  isReverse,
  currentUser,
  gotoList,
  gotoEdit,
  interconnectionTypeInfo: iti,
}) => {
  const interconnectionDetailsHook = useInterconnectionDetailsAdd({
    currentUser,
    idea_id,
    iitype_id,
    isReverse,
    interconnectionTypeInfo: iti,
  });
  const { form, status, record, find } = interconnectionDetailsHook;

  const CurrentIdea = record.currentRecord &&
    record.currentRecord.idea_current && (
      <IdeaCard
        idea={record.currentRecord.idea_current}
        ideaTypeInfo={isReverse ? iti?.name2_one : iti?.name1_one}
      />
    );

  const CurrentSelect = (
    <IdeaSelect
      error={find.errorFind}
      iitype_name={isReverse ? iti.name1_one : iti.name2_one}
      idValue={form?.values.idea_id ? form?.values.idea_id?.toString() : null}
      handleChange={form?.handleChange ?? (() => {})}
      handleFindAction={find.findIdeaToAddByID}
      ideaSelected={record.currentRecord?.idea_interconnect}
      sliceState={status.sliceStates[0]}
      resetFoundData={find.resetFoundData}
    />
  );

  const tabHeader = `Добавление взаимосвязи идеи [${record.currentRecord?.idea_current?.name}] типа: ${iti?.name}`;

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
        fetchRecord={record.fetchRecord}
        header={`Добавление взаимосвязи между идеями типа [${iti?.name}]`}
      >
        {/*<InterconnectionDetailsTitle typeName={iti?.name} />*/}
        <div className={styles.idea_top}>
          {!isReverse && CurrentIdea}
          {isReverse && CurrentSelect}
        </div>
        <InterconnectionDescription
          nameDirect={form?.values.name_direct ?? ""}
          nameReverse={form?.values.name_reverse ?? ""}
          handleChange={form?.handleChange ?? (() => {})}
          ideaTypeInfo={iti}
        />
        <div className={styles.idea_bottom}>
          {!isReverse && CurrentSelect}
          {isReverse && CurrentIdea}
        </div>
        <FillRecomendation />
        <RecordControlBlock
          gotoEntityList={gotoList}
          gotoEntityEdit={gotoEdit}
          entityDetailsHook={convertAddToEditHook(interconnectionDetailsHook)}
        />

          {/*saveButtonCaption="Добавить взаимосвязь"
          sliceState={status.sliceStates[0]}
          error={status.errorText}
          resetSliceState={status.resetSliceState}
          editStarted={form.editStarted ?? false}
          moderateNotes={null}
          setModerateNotes={(notes: string) => {}}
          */}
      </RecordEditForm>
    </>
  );
};

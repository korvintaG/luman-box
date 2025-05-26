import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { User } from "../../../../auth/user-types";
import { InterconnectionTypeInfo } from "../../../InterconnectionTypes";
import { useInterconnectionDetailsAdd } from "../../../hooks/UseInterconnectionDetailsAdd";
import { RecordEditForm } from "../../../../../shared/components/RecordEditForm/RecordEditForm";
import { InterconnectionDetailsTitle } from "../../ui/InterconnectionDetailsTitle/InterconnectionDetailsTitle";
import { IdeaCard } from "../../ui/ideaCard/ideaCard";
import { InterconnectionDescription } from "../../ui/InterconnectionDescription/InterconnectionDescription";
import { IdeaSelect } from "../../ui/IdeaSelect/IdeaSelect";
import { RecordControlBlock } from "../../../../../shared/components/RecordControlBlock/RecordControlBlock";
import { FillRecomendation } from "../../ui/FillRecomendation/FillRecomendation";
import styles from "./InterconnectionDetailsAdd.module.css";
import { BreadcrumbSimpeType } from "../../../../../shared/components/Breadcrumbs/Breadcrumbs";

export type InterconnectionDetailsAddProp = {
  idea_id: string;
  iitype_id: string;
  currentUser: User | null;
  afterSuccessDMLAction: () => void;
  isReverse: boolean;
  interconnectionTypeInfo: InterconnectionTypeInfo;
};

export const InterconnectionDetailsAdd: FC<InterconnectionDetailsAddProp> = ({
  idea_id,
  iitype_id,
  isReverse,
  currentUser,
  afterSuccessDMLAction,
  interconnectionTypeInfo: iti,
}) => {
  const { form, status, record, find } = useInterconnectionDetailsAdd({
    currentUser,
    idea_id,
    iitype_id,
    isReverse,
    interconnectionTypeInfo: iti,
  });

  const CurrentIdea = record.currentRecord &&
    record.currentRecord.ideaCurrent && (
      <IdeaCard
        idea={record.currentRecord.ideaCurrent}
        ideaTypeInfo={isReverse ? iti?.name2_one : iti?.name1_one}
      />
    );

  const CurrentSelect = (
    <IdeaSelect
      error={find.errorFind}
      iitype_name={isReverse ? iti.name1_one : iti.name2_one}
      idValue={form.values.ideaID}
      handleChange={form.handleChange}
      handleFindAction={find.findIdeaToAddByID}
      ideaSelected={record.currentRecord?.ideaInterconnect}
      sliceState={status.sliceStates[0]}
      resetFoundData={find.resetFoundData}
    />
  );

  const tabHeader = `Добавление взаимосвязи идеи [${record.currentRecord?.ideaCurrent?.name}] типа: ${iti?.name}`;

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
          nameDirect={form.values.nameDirect}
          nameReverse={form.values.nameReverse}
          handleChange={form.handleChange}
          ideaTypeInfo={iti}
        />
        <div className={styles.idea_bottom}>
          {!isReverse && CurrentSelect}
          {isReverse && CurrentIdea}
        </div>
        <FillRecomendation />
        <RecordControlBlock
          saveButtonCaption="Добавить взаимосвязь"
          sliceState={status.sliceStates[0]}
          error={status.errorText}
          afterSuccessDMLAction={() => {
            afterSuccessDMLAction();
          }}
          resetSliceState={status.resetSliceState}
        />
      </RecordEditForm>
    </>
  );
};

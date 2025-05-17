import { FC } from "react";
import { RecordEditForm } from "../../../../shared/components/RecordEditForm/RecordEditForm"; 
import { TopicKeywordsUI } from "../TopicKeywords/TopicKeywords"; 
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit"; 
import { InputSelectUI } from "../../../../shared/ui/fields/input-select/input-select"; 
import { InputTextUI } from "../../../../shared/ui/fields/input-text/input-text";
import { genHeaderText, EditAccessStatus, authorNameFromObj, getModerator, getUserCreator } from "../../../../shared/utils/utils";
import styles from "./IdeaDetails.module.css";
import { Authorship } from "../../../../shared/components/Authorship/Authorship";
import { AttitudeIdeaBlock } from "../../../../shared/components/Attitudes/AttitudeIdeaBlock/AttitudeIdeaBlock"; 
import { LinkFieldUI } from "../../../../shared/ui/fields/link-field/link-field"; 
import { InterconnectionsIconBlock } from "../IdeaInterconnections/InterconnectionIconsBlock/InterconnectionIconsBlock"; 
import { User } from "../../../auth/user-types";
import { useIdeaDetails } from "../../hooks/UseIdeaDetails";
import { genInterconnectionsURL, genSourceURL } from "../../../../app/router/navigation";
import { RecordControlBlock } from "../../../../shared/components/RecordControlBlock/RecordControlBlock";

export type IdeaDetailsProps = {
  id: string | undefined;
  currentUser: User | null;
  afterSuccessDMLAction: ()=>void;
  findSourceId: string | null;
  findKeywordId: string | null;
};

/**
 * Компонент редактирования идеи чистый
 */ 
export const IdeaDetails: FC<IdeaDetailsProps> = (
  {id, currentUser,  afterSuccessDMLAction, findSourceId, findKeywordId}) => {

  const {form, record, status, moderate } = 
     useIdeaDetails({id, currentUser, findSourceId, findKeywordId });
     
  const header = genHeaderText(
    status.editAccessStatus === EditAccessStatus.Readonly,
    id?Number(id):null,
    record.currentRecord?.name,
    "идеи",
    "жен",
  ) + (id? ` ID=${id}` :'');

  let currentSourceName='';
  if (record.currentRecord && record.currentRecord.source && record.currentRecord.source.author)
    currentSourceName=record.currentRecord.source.name + " // " + record.currentRecord.source.author.name;

  const readOnly=status.editAccessStatus === EditAccessStatus.Readonly;

  return (
    <RecordEditForm
      error={status.errorText}
      sliceState={status.sliceStates}
      fetchRecord={record.fetchRecord}
      header={header}
      onSubmit={record.handleSubmitAction}
      formClass={styles.form}
      mainClass={styles.main}
    >
      <div className={styles.inputs}>
        <Authorship
          userName={getUserCreator(record.currentRecord, currentUser)}
          moderatorName={getModerator(record.currentRecord)}
          className={styles.label_info}
        />
        {readOnly ?
          <LinkFieldUI
            URL={genSourceURL(form.values.source.id)}
            URLText={ currentSourceName }
            labelClassAdd={styles.label}
            label="Источник идеи:"
          />
          :
          <InputSelectUI
            name="source.id"
            label="Источник идеи:"
            value={form.values.source.id}
            readOnly={false}
            handleChange={form.handleChange}
            labelClassAdd={styles.label}
            values={record.sources.map((el) => ({
              id: el.id,
              name: el.name + "//" + authorNameFromObj(el.author),
            }))}
          />}
        <InputEditUI
          name="name"
          label="Название идеи:"
          value={form.values.name}
          readOnly={readOnly}
          labelClassAdd={styles.label}
          placeholder="Укажите название идеи"
          handleChange={form.handleChange}
        />
      </div>
      <div className={styles.idea}>
        <InputTextUI
          value={form.values.original_text}
          name="original_text"
          label="Вдохновивший текст"
          readOnly={readOnly}
          classAdd={styles.original}
          textClassAdd={styles.original_text}
          handleChange={form.handleChange}
        />
        <InputTextUI
          value={form.values.content}
          name="content"
          label="Суть идеи"
          readOnly={readOnly}
          classAdd={styles.content}
          handleChange={form.handleChange}
        />
      </div>
      <TopicKeywordsUI
        keywordsAll={record.keywords}
        keywordsSelected={form.values.keywords ? form.values.keywords : []}
        readOnly={readOnly}
        deleteKeyword={form.deleteKeyword}
        addKeyword={form.addKeyword}
      />
    {readOnly && id && record.currentRecord && record.currentRecord.attitudes &&
        <AttitudeIdeaBlock 
          ideaID={Number(id)} 
          attitudes={record.currentRecord.attitudes} 
          setAttitudes={form.setAttitude}
        />}
    {id && record.currentRecord && record.currentRecord.interconnections && 
      <InterconnectionsIconBlock 
        generateRoute={(tid:number)=>  genInterconnectionsURL(Number(id), tid)}
        readOnly={!currentUser}
        interconnections={record.currentRecord.interconnections}
    />}
      <RecordControlBlock
        id={id}
        sliceState={status.sliceStates[0]}
        error={status.errorText}
        editAccessStatus={status.editAccessStatus}
        deleteRecord={record.deleteRecordAction}
        afterSuccessDMLAction={afterSuccessDMLAction}
        approveRecord={moderate.approveRecordAction}
        rejectRecord={moderate.rejectRecordAction}
      />      

    </RecordEditForm>
  );
};


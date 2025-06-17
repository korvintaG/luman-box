import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { RecordEditForm } from "../../../../../shared/components/RecordEditForm/RecordEditForm";
import { TopicKeywords } from "../../ui/TopicKeywords/TopicKeywords";
import { InputEditUI } from "../../../../../shared/ui/fields/input-edit/input-edit";
import { InputSelectUI } from "../../../../../shared/ui/fields/input-select/input-select";
import { InputTextUI } from "../../../../../shared/ui/fields/input-text/input-text";
import {
  genHeaderText,
  EditAccessStatus,
  authorNameFromObj,
  getModerator,
  getUserCreator,
  HeaderParType,
  genTabHeaderText,
  isSafeSvg,
  sourceFullNameFromObj,
} from "../../../../../shared/utils/utils";
import styles from "./IdeaDetails.module.css";
import { Authorship } from "../../../../../shared/components/Authorship/Authorship";
import { AttitudesBlock } from "../../ui/AttitudesBlock/AttitudesBlock";
import { InterconnectionsIconBlock } from "../../ui/InterconnectionIconsBlock/InterconnectionIconsBlock";
import { User } from "../../../../auth/user-types";
import { useIdeaDetails } from "../../../hooks/UseIdeaDetails";
import {
  genInterconnectionsURL,
  genSourceURL,
} from "../../../../../app/router/navigation";
import { RecordControlBlock } from "../../../../../shared/components/RecordControlBlock/RecordControlBlock";
import { BreadcrumbSimpeType } from "../../../../../shared/components/Breadcrumbs/Breadcrumbs";
import SvgIcon from "../../../../../shared/components/SvgIcon/SvgIcon";
import { Classes } from "../../../../../shared/ui/UITypes";

export type IdeaDetailsProps = {
  id: string | undefined;
  currentUser: User | null;
  afterSuccessDMLAction: () => void;
  findSourceId: string | null;
  findKeywordId: string | null;
};

export const IdeaDetails: FC<IdeaDetailsProps> = ({
  id,
  currentUser,
  afterSuccessDMLAction,
  findSourceId,
  findKeywordId,
}) => {
  const { form, record, status, moderate } = useIdeaDetails({
    id,
    currentUser,
    findSourceId,
    findKeywordId,
  });

  const params: HeaderParType = [
    status.editAccessStatus === EditAccessStatus.Readonly,
    id ? Number(id) : null,
    record.currentRecord?.name,
    "идеи",
    "жен",
  ];
  const header = genHeaderText(...params) + (id ? ` ID=${id}` : "");
  const tabHeader = genTabHeaderText(...params);

  const readOnly = status.editAccessStatus === EditAccessStatus.Readonly;
  const classes:Classes={
    classInputAdd:styles.input,
    classLabelAdd:styles.label
  }

  return (
    <>
      <Helmet>
        <title>{tabHeader}</title>
      </Helmet>

      <RecordEditForm
        error={status.errorText}
        sliceState={status.sliceStates}
        fetchRecord={record.fetchRecord}
        breadcrumbs={[BreadcrumbSimpeType.IdeasList]}
        header={header}
        onSubmit={record.handleSubmitAction}
        mainClass={styles.main}
        formClass={styles.form}
      >
        <div className={styles.form_header}>
          {form.values.SVG &&
            form.values.SVG.length > 0 &&
            isSafeSvg(form.values.SVG) && (
              <SvgIcon
                svgString={form.values.SVG}
                className={styles.idea_icon}
              />
            )}
          <div className={styles.form_header_inputs}>
            <Authorship
              userName={getUserCreator(record.currentRecord, currentUser)}
              moderatorName={getModerator(record.currentRecord)}
            />
            <InputSelectUI
              name="source.id"
              readOnly={readOnly}
              label="Источник идеи:"
              value={form.values.source.id}
              onChange={form.handleChange}
              URL={genSourceURL(form.values.source.id)}
              valueText={sourceFullNameFromObj(record.currentRecord?.source)}
              classes={classes}
              values={record.sources.map((el) => ({
                id: el.id,
                name: el.name + "//" + authorNameFromObj(el.author),
              }))}
            />
            <InputEditUI
              name="name"
              label="Название идеи:"
              value={form.values.name}
              readOnly={readOnly}
              placeholder="Укажите название идеи"
              onChange={form.handleChange}
              classes={classes}
            />
          </div>
        </div>
        <div className={styles.idea_core}>
          <InputTextUI
            value={form.values.original_text}
            name="original_text"
            label="Вдохновивший текст"
            readOnly={readOnly}
            classes={{ classInputAdd: styles.original_text }}
            onChange={form.handleChange}
          />
          <InputTextUI
            value={form.values.content}
            name="content"
            label="Суть идеи"
            readOnly={readOnly}
            onChange={form.handleChange}
          />
        </div>
        
        {!readOnly && (
          <div className={styles.content_SVG}>
          <InputTextUI
            value={form.values.SVG ? form.values.SVG : ""}
            name="SVG"
            label="Код SVG-иконки идеи (необязательно)"
            readOnly={readOnly}
            onChange={form.handleChange}
          />
          </div>
        )}
       <TopicKeywords
          keywordsAll={record.keywords}
          keywordsSelected={form.values.keywords ? form.values.keywords : []}
          readOnly={readOnly}
          deleteKeyword={form.deleteKeyword}
          addKeyword={form.addKeyword}
        />
        {readOnly &&
          id &&
          record.currentRecord &&
          record.currentRecord.attitudes && (
            <AttitudesBlock
              ideaID={Number(id)}
              attitudes={record.currentRecord.attitudes}
              setAttitudes={form.setAttitude}
            />
          )}
        {id &&
          record.currentRecord &&
          record.currentRecord.interconnections && (
            <InterconnectionsIconBlock
              generateRoute={(tid: number) =>
                genInterconnectionsURL(Number(id), tid)
              }
              readOnly={!currentUser}
              interconnections={record.currentRecord.interconnections}
            />
          )}
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
    </>
  );
};

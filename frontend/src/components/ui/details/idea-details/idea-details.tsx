import { FC, ChangeEvent, SyntheticEvent } from "react";
import {
  HTMLEditElement,
  IdeaRaw,
  Source,
  Keyword,
  authorNameFromObj,
  IdeaAttitudes,
  UserAttitudeIdea,
} from "../../../../utils/type";
import { RecordEditUI } from "../../uni/record-edit/record-edit";
import { TopicKeywordsUI } from "../topic-keywords/topic-keywords";
import { RecordButtonBlockUI } from "../../uni/record-buttons-block/record-buttons-block";
import { InputEditUI } from "../../uni/input-edit/input-edit";
import { InputSelectUI } from "../../uni/input-select/input-select";
import { InputTextUI } from "../../uni/input-text/input-text";
import { genHeaderText, EditAccessStatus } from "../../../../utils/utils";
import styles from "./idea-details.module.css";
import { Authorship } from "../authorship/authorship";
import { Attitude } from "../../uni/attitude/attitude";
import { AttitudeIdea } from "../../uni/attitude-idea/attitude-idea";
import { Link } from "react-router-dom";
import { getRouteParam, appRoutes } from "../../../../AppRoutes";
import { LinkFieldUI } from "../../uni/link-field/link-field";


export type IdeaDetailsUIProps = {
  id: number | null;
  values: IdeaRaw; // поля идеи для редактирования
  editAccessStatus: EditAccessStatus;
  handleChange: (e: ChangeEvent<HTMLEditElement>) => void; // для реактивности изменения данных
  handleSubmit: (e: SyntheticEvent) => void; // действие
  deleteRecord: (e: SyntheticEvent) => void; // удалить текущую идею
  approveRecord: (e: SyntheticEvent) => void; // одобрить ключевое слово к идеи
  rejectRecord: (e: SyntheticEvent) => void; // отвергнуть ключевое слово к идеи
  deleteKeyword: (e: SyntheticEvent, id: number) => void; // удалить ключевое слово к идеи
  addKeyword: (id: number) => void; // добавить ключевое слово к идеи
  setAttitude?: (attitude: UserAttitudeIdea) =>void;
  sources: Source[]; // источники для выбора
  keywords: Keyword[]; // ключевые слова для выбора
  initialName: string; // начальное название идеи для отображения
  userName: string;
  moderatorName?: string | null;
  attitudes?: IdeaAttitudes;
};

/**
 * Компонент редактирования идеи чистый
 */
export const IdeaDetailsUI: FC<IdeaDetailsUIProps> = (
  props: IdeaDetailsUIProps,
) => {
  const header = genHeaderText(
    props.editAccessStatus === EditAccessStatus.Readonly,
    props.id,
    props.initialName,
    "идеи",
    "жен",
  );
  const btnCaptione = props.id ? "Сохранить данные" : "Добавить идею";

  let currentSourceName='';
  const currentSource=props.sources.find((el) => el.id === props.values.source.id);
  if (currentSource)
    currentSourceName=currentSource.name + " // " + authorNameFromObj(currentSource.author);

  const readOnly=props.editAccessStatus === EditAccessStatus.Readonly;

  return (
    <RecordEditUI
      header={header}
      onSubmit={props.handleSubmit}
      formClass={styles.form}
      mainClass={styles.main}
    >
      <div className={styles.inputs}>
        <Authorship
          userName={props.userName}
          moderatorName={props.moderatorName}
          className={styles.label_info}
        />
        {readOnly ?
          <LinkFieldUI
            URL={getRouteParam(appRoutes.source, props.values.source.id)}
            URLText={ currentSourceName }
            labelClassAdd={styles.label}
            label="Источник идеи:"
          />
          :
          <InputSelectUI
            name="source.id"
            label="Источник идеи:"
            value={props.values.source.id}
            readOnly={false}
            handleChange={props.handleChange}
            labelClassAdd={styles.label}
            values={props.sources.map((el) => ({
              id: el.id,
              name: el.name + "//" + authorNameFromObj(el.author),
            }))}
          />}
        <InputEditUI
          name="name"
          label="Название идеи:"
          value={props.values.name}
          readOnly={readOnly}
          labelClassAdd={styles.label}
          placeholder="Укажите название идеи"
          handleChange={props.handleChange}
        />
      </div>
      <div className={styles.idea}>
        <InputTextUI
          value={props.values.original_text}
          name="original_text"
          label="Вдохновивший текст"
          readOnly={readOnly}
          classAdd={styles.original}
          textClassAdd={styles.original_text}
          handleChange={props.handleChange}
        />
        <InputTextUI
          value={props.values.content}
          name="content"
          label="Суть идеи"
          readOnly={readOnly}
          classAdd={styles.content}
          handleChange={props.handleChange}
        />
      </div>
      <TopicKeywordsUI
        keywordsAll={props.keywords}
        keywordsSelected={props.values.keywords ? props.values.keywords : []}
        readOnly={readOnly}
        deleteKeyword={props.deleteKeyword}
        addKeyword={props.addKeyword}
      />
    {readOnly && props.id && props.attitudes &&
        <AttitudeIdea ideaID={props.id} attitudes={props.attitudes} setAttitudes={props.setAttitude}
    />}
      <RecordButtonBlockUI
        id={props.id}
        editAccessStatus={props.editAccessStatus}
        deleteRecord={props.deleteRecord}
        approveRecord={props.approveRecord}
        rejectRecord={props.rejectRecord}
        submitButtonCaption={btnCaptione}
        deleteButtonCaption="Удалить идею"
      />
    </RecordEditUI>
  );
};

//blockClass={styles.buttons}
export function IdeaDetailsUIFC(props: IdeaDetailsUIProps) {
  return <IdeaDetailsUI {...props} />;
}

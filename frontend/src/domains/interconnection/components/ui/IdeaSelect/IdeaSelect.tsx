import { FC, SyntheticEvent } from "react";
import {
  HTMLEditElement,
  RequestStatus,
} from "../../../../../shared/types/types-for-hooks";
import { InputEditUI } from "../../../../../shared/ui/fields/input-edit/input-edit";
import { IdeaForList } from "../../../../idea/types/IdeaTypes";
import { genIdeaURL, genSourceURL } from "../../../../../app/router/navigation";
import styles from "./ideaSelect.module.css";
import { ErrorMessageUI } from "../../../../../shared/ui/ErrorMessage/ErrorMessage";
import SandClockLoader from "../../../../../shared/ui/SandClockLoader/SandClockLoader";
import { LinkFieldUI } from "../../../../../shared/ui/fields/link-field/link-field";

export type IdeaSelectProps = {
  iitype_name: string | null;
  idValue: string | null;
  handleChange: (event: React.ChangeEvent<HTMLEditElement>) => void;
  handleFindAction: (e: SyntheticEvent) => void;
  ideaSelected: IdeaForList | null | undefined;
  error: string;
  sliceState: RequestStatus;
  resetFoundData: () => void;
};
export const IdeaSelect: FC<IdeaSelectProps> = ({
  sliceState,
  error,
  iitype_name,
  idValue,
  handleChange,
  handleFindAction,
  ideaSelected,
  resetFoundData,
}) => {
  const handleChangeAction = (
    event: React.ChangeEvent<HTMLEditElement>
  ): void => {
    handleChange(event);
    resetFoundData();
  };

  return (
    <div className={styles.container}>
      <h3>[{iitype_name}]</h3>
      <div className={styles.idea}>
        <InputEditUI
          value={idValue ? idValue : ""}
          name="idea_id"
          label="Идея ID:"
          classes={{ classInputAdd: styles.ID_input }}
          onChange={handleChangeAction}
          type="number"
        />
        <div className={styles.button_block}>
          <button onClick={handleFindAction}>Найти</button>
          {sliceState === RequestStatus.Finding && (
            <SandClockLoader size="small" />
          )}
          {error && (
            <div>
              <ErrorMessageUI error={error} />
            </div>
          )}
        </div>
        <LinkFieldUI
          label="Название:"
          classes={{
            classLabelAdd: styles.name_label,
            classInputAdd: styles.name,
          }}
          to={
            ideaSelected && ideaSelected.id && ideaSelected.name
              ? genIdeaURL(ideaSelected.id)
              : ""
          }
        >
          {ideaSelected ? ideaSelected.name : ""}
        </LinkFieldUI>

        <LinkFieldUI
          label="Источник:"
          classes={{
            classLabelAdd: styles.source_label,
            classInputAdd: styles.source,
          }}
          to={
            ideaSelected && ideaSelected.source_id && ideaSelected.source_name
              ? genSourceURL(ideaSelected.source_id)
              : ""
          }
        >
          {ideaSelected ? ideaSelected.source_name : ""}
        </LinkFieldUI>
      </div>
    </div>
  );
};

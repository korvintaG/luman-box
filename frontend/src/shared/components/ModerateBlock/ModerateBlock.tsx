import { ChangeEvent, FC, SyntheticEvent } from "react";
import styles from "./ModerateBlock.module.css";
import { ButtonUI } from "../../ui/button"; 
import { InputEditUI } from "../../ui/fields/input-edit/input-edit";

export type ModerateBlockUIProps = {
  approveRecord: (e: SyntheticEvent) => void; // действия по одобрению записи
  rejectRecord: (e: SyntheticEvent) => void; // действия по отвержению записи
  moderateNotes: string | null;
  setModerateNotes: (notes: string) => void;
};

export const ModerateBlockUI: FC<ModerateBlockUIProps> = (props) => {
  return (
    <div className={styles.block}>
      <ButtonUI logicType="moderate-approve" onClick={props.approveRecord} caption="Одобрить" />
      <ButtonUI logicType="moderate-reject" onClick={props.rejectRecord} caption="Отвергнуть" />
      <input 
        value={props.moderateNotes || ""} 
        onChange={(e: ChangeEvent<HTMLInputElement>) => 
          props.setModerateNotes(e.target.value)
        } 
      />
    </div>
  );
};

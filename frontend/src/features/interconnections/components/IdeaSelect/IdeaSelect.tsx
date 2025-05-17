import { FC, SyntheticEvent } from "react";
import { HTMLEditElement, RequestStatus, SimpleNameObject } from "../../../../shared/common-types";
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit";
import { IdeaForList } from "../../../ideas/IdeaTypes";
import { Link } from "react-router-dom";
import { genIdeaURL, genSourceURL } from "../../../../app/router/navigation";
import styles from "./ideaSelect.module.css";
import { ErrorMessageUI } from "../../../../shared/ui/ErrorMessage/ErrorMessage";
import { Preloader } from "../../../../shared/ui/Preloader";
import SandClockLoader from "../../../../shared/ui/SandClockLoader/SandClockLoader";

export type IdeaSelectProps = {
    iitype_name: string | null;
    idValue: string | null;
    handleChange:  (event: React.ChangeEvent<HTMLEditElement>) => void;
    handleFindAction: (e: SyntheticEvent) => void;
    ideaSelected:  IdeaForList | null | undefined;
    error: string;
    sliceState: RequestStatus;
    resetFoundData: ()=>void;
}
export const IdeaSelect: FC<IdeaSelectProps> = 
    ({sliceState, error, iitype_name, idValue, handleChange, handleFindAction, ideaSelected, resetFoundData}) =>
{
    const handleChangeAction= (event: React.ChangeEvent<HTMLEditElement>) : void => {
        handleChange(event);
        resetFoundData();
    }

    return <div className={styles.container}>
        <h3>[{iitype_name}]</h3>
        <div className={styles.subcontainer}>
            <label>Идея ID:</label>
            <div className={styles.find_block}>
                <InputEditUI 
                    value={idValue?idValue:''}
                    name="ideaID"
                    label=""
                    handleChange={handleChangeAction}
                    classReplace={styles.ID_input}
                    isNumber
                />
                <button onClick={handleFindAction} >Найти</button>
                {sliceState===RequestStatus.Finding && <SandClockLoader size="small" />}
                {error && <div className={styles.error_container}>
                    <ErrorMessageUI error={error}/>
                </div>}
            </div>
            <label>Название:</label> 
            {ideaSelected && ideaSelected.id && ideaSelected.name ? 
                <Link to={genIdeaURL(ideaSelected.id)}>
                    {ideaSelected.name}
                </Link> 
                :<div></div>}
            <label>Источник:</label> 
            {ideaSelected && ideaSelected.source_id &&  ideaSelected.source_name ?
                <Link className={styles.source_name} to={genSourceURL(ideaSelected.source_id)}>
                    {ideaSelected.source_name}
                </Link>
                :<div></div>}
        </div>                
    </div>
}
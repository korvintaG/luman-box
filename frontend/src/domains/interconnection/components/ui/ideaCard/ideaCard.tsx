import { FC } from "react";
import { SimpleNameObject } from "../../../../../shared/types/entity-types";
import styles from "./ideaCard.module.css";
import { Link } from "react-router-dom";
import { genIdeaURL, genSourceURL } from "../../../../../app/router/navigation";
import { IdeaForList } from "../../../../idea/types/IdeaTypes";


export type IdeaCardProp =   {
    idea:IdeaForList;
    ideaTypeInfo?: string;
}

export const IdeaCard: FC <IdeaCardProp> = ({idea,  ideaTypeInfo} ) => {
    return <div className={styles.container}>
        <label>Идея ID:</label>
        <p> {idea.id} {ideaTypeInfo && `[${ideaTypeInfo}]`}</p>
        <label>Название:</label> 
        <Link to={genIdeaURL(idea.id)}>{idea.name}</Link>
        <label>Источник:</label> 
        <Link className={styles.source_name} to={genSourceURL(idea.source_id)}>{idea.source_name}</Link>
    </div>
}
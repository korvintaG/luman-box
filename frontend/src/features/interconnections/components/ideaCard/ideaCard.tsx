import { FC } from "react";
import { SimpleNameObject } from "../../../../shared/common-types";
import styles from "./ideaCard.module.css";
import { Link } from "react-router-dom";
import { genIdeaURL, genSourceURL } from "../../../../app/router/navigation";


export type IdeaCardProp =  SimpleNameObject & {
    ideaTypeInfo?: string;
    source: SimpleNameObject
}

export const IdeaCard: FC <IdeaCardProp> = ({id, name, ideaTypeInfo, source} ) => {
    return <div className={styles.container}>
        <label>Идея ID:</label><p> {id} {ideaTypeInfo && `[${ideaTypeInfo}]`}</p>
        <label>Название:</label> <Link to={genIdeaURL(id)}>{name}</Link>
        <label>Источник:</label> <Link className={styles.source_name} to={genSourceURL(source.id)}>{source.name}</Link>
    </div>
}
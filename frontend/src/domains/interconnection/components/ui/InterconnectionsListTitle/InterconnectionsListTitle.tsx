import { FC } from "react";
import { Link } from "react-router-dom";
import { genIdeaURL, genSourceURL } from "../../../../../app/router/navigation";
import { IdeaForList } from "../../../../idea/types/IdeaTypes";
import styles from "./InterconnectionsListTitle.module.css"
import clsx from "clsx";

type InterconnectionsListTitleProps = {
    idea: IdeaForList;
    iitype_name:string;
}

export const InterconnectionsListTitle: FC<InterconnectionsListTitleProps> = ( props)=>{
    return <h1 className={styles.container}>
        <div className={styles.header_part}>
            <label>Текущая идея:</label>
            <p className={styles.value}>[<Link to={genIdeaURL(props.idea.id)}>
                    {`${props.idea.name}`}
                </Link>
                , ID={props.idea.id}]</p>
        </div>
        <div className={styles.header_part}>
            <label>Источник идеи:</label>
            <Link
                className={clsx(styles.value,styles.source_URL)} 
                to={genSourceURL(props.idea.source_id)}>
                {props.idea.source_name}
            </Link>
        </div>
        <div className={styles.header_part}>
            <label>Тип взаимосвязи: </label>
            <p className={clsx(styles.value,styles.interconnections_type_comment)}>
                        {props.iitype_name}
            </p>
        </div>
    </h1>
}

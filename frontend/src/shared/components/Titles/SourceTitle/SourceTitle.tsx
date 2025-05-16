import { FC } from "react";
import { Link } from "react-router-dom";
import styles from "./SourceTitle.module.css";
import { genSourceURL } from "../../../../app/router/navigation";


type SourceTitleProps = {
    sourceID: number;
    sourceName: string;
}

export const SourceTitle: FC<SourceTitleProps> = ( {sourceID, sourceName})=>{
    return <span>Источник идеи:&nbsp; 
    <Link 
        className={styles.source_URL} 
        to={genSourceURL(sourceID)}>
    {sourceName}
    </Link>
</span>
}

import { FC, useEffect, SyntheticEvent } from 'react';
import styles from './keyword.module.css'
import { Link } from 'react-router-dom';


export type KeywordUIProps = {
    id: number;
    name: string;
    deleteKeyword: (e: SyntheticEvent, id: number) => void;
}

export const KeywordUI: FC<KeywordUIProps> = ({id, name, deleteKeyword}) => {
   
    return <div className={styles.keyword}>
        <Link to={`/keywords/${id}`}>{'#'+name}</Link>
        <button className={styles.btnClose} onClick={(e:SyntheticEvent)=>deleteKeyword(e,id)}>x</button>
        </div>
}

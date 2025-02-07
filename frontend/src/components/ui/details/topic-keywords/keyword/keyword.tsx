import { FC, useEffect, SyntheticEvent } from 'react';
import styles from './keyword.module.css'
import { Link } from 'react-router-dom';
import { getRouteParam , appRoutes} from '../../../../../AppRoutes'


export type KeywordUIProps = {
    id: number;
    name: string;
    deleteKeyword: (e: SyntheticEvent, id: number) => void;
    readOnly?:boolean;
}

export const KeywordUI: FC<KeywordUIProps> = ({id, name, readOnly, deleteKeyword}) => {
   
    return <div className={styles.keyword}>
        <Link to={getRouteParam(appRoutes.keyword,id)}>{'#'+name}</Link>
        <button className={styles.btnClose} 
            disabled={readOnly}
            onClick={(e:SyntheticEvent)=>deleteKeyword(e,id)}>
            x
        </button>
        </div>
}

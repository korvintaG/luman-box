import { FC } from 'react';
import { SimpleNameObject } from '../../../../utils/type';
import { Link } from 'react-router-dom';
import { getRouteParam } from '../../../../AppRoutes'
import styles from './relation-list.module.css';

export type RelationListUIProps = {
    title: string,
    list: SimpleNameObject[] | undefined,
    editURLPath: string
}

export const RelationListUI : FC<RelationListUIProps> = ({list, title, editURLPath}) => {
    if (!list || list.length===0)
        return null;
    const clonedArray = list.map(a => {return {...a}})
    clonedArray.sort((a, b) => a.name.localeCompare(b.name));
    return <section className={styles.block}>
        <h2 className={styles.header}>{title}</h2>
        <ul>
            {clonedArray.map((el)=>{return <li className={styles.element}>
                <Link 
                    to={getRouteParam(editURLPath,el.id)}>
                    {el.name}
                </Link>
            </li>})}
        </ul>
    </section>
}

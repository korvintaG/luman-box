import { FC } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { SimpleNameObjectWithCnt } from '../../../../utils/type'
import { appRoutes } from '../../../../AppRoutes'

import styles from './source-keywords.module.css'

export type SourceKeywordsUIProps = {
    title: string;
    source_id: number;
    keywordsAll: SimpleNameObjectWithCnt[] | undefined; // ключевые слова для выбора
}

export const SourceKeywordsUI: FC<SourceKeywordsUIProps> = (props) => {
    if (!props.keywordsAll || props.keywordsAll.length===0)
        return null;
    return <section className={styles.block} >
        <h3 className={styles.header}>{props.title}</h3>
        <p className={styles.sub_block}>
            {props.keywordsAll.map((el)=>{
                    if (el.cnt===1)
                        return <Link 
                            className={styles.element} 
                            to={appRoutes.ideaFind+'?source_id='+props.source_id+'&keyword_id='+ el.id}> 
                                {'#'+el.name}
                            </Link>
                    else
                        return <Link className={styles.element}
                            to={appRoutes.ideas+'?source_id='+props.source_id+'&keyword_id='+el.id} 
                        >
                            {'#'+el.name}
                        </Link>
                })
            }
        </p>
    </section>
}

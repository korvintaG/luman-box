import { FC } from 'react';
import clsx from 'clsx';
import { Source,  sourceFullNameFromObj } from '../../../../utils/type';
import { RecordListUI } from '../../../../components/ui/uni/record-list'
import { Link } from 'react-router-dom';
import { getRouteParam , appRoutes} from '../../../../AppRoutes'
import styles from './source-list.module.css';

export type SourceListUIProps = {
    sources: Source[],
    readOnly?:boolean;
    addNewSource: ()=>void,
    isLoading: boolean
}

export const SourceListUI : FC<SourceListUIProps> = ({sources, readOnly, addNewSource, isLoading}) => {
    return <RecordListUI 
            header='Список источников' 
            captionAddButton='Добавить источник'
            readOnly={readOnly}
            addRecord={addNewSource}
            liMobileAlteration
            isLoading={isLoading}>
                {sources.map((source) => 
                <li key={source.id} className={styles.source_li}>
                    <Link
                        className={clsx(styles.link, {['moderated-need']:!source.moderated})}
                        to={getRouteParam(appRoutes.source,source.id)} >
                        {sourceFullNameFromObj(source)}
                    </Link>
                </li>)
                }
    </RecordListUI>


}

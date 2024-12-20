import { FC } from 'react';
import { SourceExtension } from '../../../../utils/type';
import { RecordListUI } from '../../../../components/ui/uni/record-list'
import { Link } from 'react-router-dom';
import { getRouteParam , appRoutes} from '../../../../AppRoutes'
import styles from './source-list.module.css';

export type SourceListUIProps = {
    sources: SourceExtension[],
    addNewSource: ()=>void,
    isLoading: boolean
}

export const SourceListUI : FC<SourceListUIProps> = ({sources, addNewSource, isLoading}) => {
    return <RecordListUI 
            header='Список источников' 
            captionAddButton='Добавить источник'
            addRecord={addNewSource}
            liMobileAlteration
            isLoading={isLoading}>
                {sources.map((source) => 
                <li key={source.id}>
                    <Link
                        className={styles.link}
                        to={getRouteParam(appRoutes.source,source.id)} >
                        {source.name + ' // ' + source.authorName}
                    </Link>
                </li>)
                }
    </RecordListUI>


}

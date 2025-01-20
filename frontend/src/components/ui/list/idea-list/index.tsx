import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Idea , sourceFullNameFromObj} from '../../../../utils/type';
import { RecordListUI } from '../../uni/record-list';
import { getRouteParam , appRoutes} from '../../../../AppRoutes'
import styles from './ideas-list.module.css';


export type IdeaListUIProps = {
    ideas: Idea[],
    addNewIdea: ()=>void,
    isLoading: boolean,
    readOnly?:boolean

}

export const IdeaListUI : FC<IdeaListUIProps> = ({ideas, readOnly, addNewIdea, isLoading}) => {

    return <RecordListUI 
        skipUl
        header='Список идей' 
        captionAddButton='Добавить идею'
        readOnly={readOnly}
        addRecord={addNewIdea} 
        isLoading={isLoading}>
            <table className={styles.list}>
                <thead>
                    <tr><th>Название идеи</th><th>Источник</th><th>Пользователь</th><th>Добавлено</th></tr>
                </thead>
                <tbody>
                    {ideas.map((idea) => (
                        <tr key={idea.id}>
                            <td>
                                    <Link
                                    to={getRouteParam(appRoutes.idea,idea.id)} >
                                    {idea.name }
                                    </Link>
                            </td>
                            <td>
                                {idea.source &&
                                    <Link
                                    to={getRouteParam(appRoutes.source,idea.source.id)} >
                                    {sourceFullNameFromObj(idea.source)}
                                    </Link>
                                }
                            </td>
                            <td>
                                    <Link
                                    to=''>
                                    {/*idea.user */}
                                    </Link>
                            </td>
                            <td className={styles.date_time}>
                                    {idea.date_time_create }
                            </td>
                        </tr>))
                    }
                </tbody>
            </table>
        </RecordListUI>;
} 
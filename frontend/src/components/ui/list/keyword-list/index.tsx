import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Keyword } from '../../../../utils/type';
import { RecordListUI } from '../../uni/record-list';
import { getRouteParam , appRoutes} from '../../../../AppRoutes'

export type KeywordListUIProps = {
    keywords: Keyword[],
    addNewKeyword: ()=>void,
    isLoading: boolean
}

export const KeywordListUI : FC<KeywordListUIProps> = ({keywords, addNewKeyword, isLoading}) => {

    return <RecordListUI 
        header='Список ключевых слов' 
        captionAddButton='Добавить ключевое слово'
        addRecord={addNewKeyword}
        isLoading={isLoading}>
            {keywords.map((keyword) => (
                <li key={keyword.id}>
                    <Link
                        to={getRouteParam(appRoutes.keyword,keyword.id)} > 
                        {keyword.name}
                    </Link>
                </li>))
            }
    </RecordListUI>;
};

import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Author} from '../../../../utils/type';
import { RecordListUI } from '../../../../components/ui/uni/record-list'
import { getRouteParam , appRoutes} from '../../../../AppRoutes'

export type AuthorListUIProps = {
    authors: Author[],
    addNewAuthor: ()=>void,
    isLoading: boolean
}

export const AuthorListUI : FC<AuthorListUIProps> = ({authors, addNewAuthor, isLoading}) => {
    return (
        <RecordListUI 
            header='Список авторов' 
            captionAddButton='Добавить автора'
            addRecord={addNewAuthor}
            isLoading={isLoading}>
                    {authors.map((author) => (
                        <li key={author.id}>
                            <Link
                                to={getRouteParam(appRoutes.author,author.id)} >
                                {author.name}
                            </Link>
                        </li>))
                    }
        </RecordListUI>
    );
}
import { FC } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useAuthorList } from "../../hooks/UseAuthorList";
import { RecordsList } from "../../../../shared/components/RecordsList";
import { genAuthorURL } from "../../../../app/router/navigation";
import { getVerificationClass } from "../../../../shared/CSS/CSS-utils";

type AuthorsListProps = {
    readOnly: boolean;
    gotoAuthorAdd: ()=>void;
}

export const AuthorList: FC<AuthorsListProps> = ({readOnly, gotoAuthorAdd}) => {
    const {authors, sliceState, addNewAuthor, fetchRecords, error } = useAuthorList(gotoAuthorAdd);
  
    return <RecordsList
              header="Список авторов"
              readOnly={readOnly}
              sliceState={sliceState}
              error={error}
              fetchRecords={fetchRecords}
              captionAddButton="Добавить автора"
              addRecord={addNewAuthor}
            >
              {authors.map((author) => (
                <li key={`author_list_${author.id}`}>
                  <Link
                    key={`author_link_${author.id}`}
                    className={getVerificationClass(author.verification_status)}
                    to={genAuthorURL(author.id)}
                  >
                    {author.name}
                  </Link>
                </li>
              ))}
    </RecordsList>
}
  
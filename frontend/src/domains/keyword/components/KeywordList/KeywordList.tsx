import { FC } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { RecordsList } from "../../../../shared/components/RecordsList"; 
import { useKeywordsList } from "../../hooks/UseKeywordsList";
import { genKeywordURL } from "../../../../app/router/navigation";
import { getVerificationClass } from "../../../../shared/CSS/CSS-utils";

export type KeywordListUIProps = {
  readOnly?: boolean;
  gotoKeywordAdd: ()=>void;
};

export const KeywordList: FC<KeywordListUIProps> = ({
  readOnly, gotoKeywordAdd
}) => {
    const {keywords, addNewKeyword, sliceState , error, fetchRecords } = useKeywordsList(gotoKeywordAdd);
  return (<RecordsList
      header="Список ключевых слов"
      captionAddButton="Добавить ключевое слово"
      readOnly={readOnly}
      addRecord={addNewKeyword}
      fetchRecords={fetchRecords}
      sliceState={sliceState}
      error={error}
   
  >
      {keywords.map((keyword, index) => (
        <li key={keyword.id} data-cy={`keyword_list_${index}`}>
          <Link
            to={genKeywordURL(keyword.id)}
            data-cy={`keyword_link_${index}`}
            className={getVerificationClass(keyword.verification_status)}
          >
            {keyword.name}
          </Link>
        </li>
      ))}
      </RecordsList> 
  );
};
//            className={clsx({ "moderated-need": !keyword.moderated })}

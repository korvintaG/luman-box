import { FC } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { RecordsList } from "../../../../shared/components/RecordsList"; 
import { useKeywordsList } from "../../hooks/UseKeywordsList";
import { genKeywordURL } from "../../../../app/router/navigation";

export type KeywordListUIProps = {
  readOnly?: boolean;
  gotoKeywordAdd: ()=>void;
};

export const KeywordList: FC<KeywordListUIProps> = ({
  readOnly, gotoKeywordAdd
}) => {
    const {keywords, addNewKeyword, sliceState , error, fetchRecords } = useKeywordsList(gotoKeywordAdd);
  return (
    <RecordsList
      header="Список ключевых слов"
      captionAddButton="Добавить ключевое слово"
      readOnly={readOnly}
      addRecord={addNewKeyword}
      fetchRecords={fetchRecords}
      sliceState={sliceState}
      error={error}
    >
      {keywords.map((keyword) => (
        <li key={keyword.id}>
          <Link
            className={clsx({ "moderated-need": !keyword.moderated })}
            to={genKeywordURL(keyword.id)}
          >
            {keyword.name}
          </Link>
        </li>
      ))}
    </RecordsList>
  );
};

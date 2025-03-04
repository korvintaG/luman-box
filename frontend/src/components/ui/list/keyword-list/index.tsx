import { FC } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Keyword } from "../../../../utils/type";
import { RecordListUI } from "../../uni/record-list";
import { getRouteParam, appRoutes } from "../../../../AppRoutes";

export type KeywordListUIProps = {
  keywords: Keyword[];
  readOnly?: boolean;
  addNewKeyword: () => void;
  isLoading: boolean;
};

export const KeywordListUI: FC<KeywordListUIProps> = ({
  keywords,
  readOnly,
  addNewKeyword,
  isLoading,
}) => {
  return (
    <RecordListUI
      header="Список ключевых слов"
      captionAddButton="Добавить ключевое слово"
      readOnly={readOnly}
      addRecord={addNewKeyword}
      isLoading={isLoading}
    >
      {keywords.map((keyword) => (
        <li key={keyword.id}>
          <Link
            className={clsx({ "moderated-need": !keyword.moderated })}
            to={getRouteParam(appRoutes.keyword, keyword.id)}
          >
            {keyword.name}
          </Link>
        </li>
      ))}
    </RecordListUI>
  );
};

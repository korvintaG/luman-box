import { FC } from "react";
import { useSelector } from "../../shared/services/store";
import { selectCurrentUser } from "../../features/auth/store/AuthSlice";
import { KeywordList } from "../../features/keywords/components/KeywordsList/KeywordsList";
import { useNavigate } from "react-router-dom";
import { genKeywordAddURL } from "../../app/router/navigation";

/**
 * Страница список ключевых слов
 */
export const KeywordsListPage: FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate=useNavigate();

  const gotoKeywordAdd = () => {
    navigate(genKeywordAddURL)
  }

  return (
    <KeywordList
      readOnly={!currentUser}
      gotoKeywordAdd={gotoKeywordAdd}
    />
  );
};

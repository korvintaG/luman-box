import { FC } from "react";
import { useSelector } from "../../../shared/services/store";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { KeywordList } from "../components/KeywordList/KeywordList";
import { useNavigate } from "react-router-dom";
import { genKeywordAddURL } from "../../../app/router/navigation";
import { Helmet } from "react-helmet-async";

/**
 * Страница список ключевых слов
 */
export const KeywordsListPage: FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const gotoKeywordAdd = () => {
    navigate(genKeywordAddURL);
  };

  return (
    <>
      <Helmet>
        <title>Список ключевых слов</title>
      </Helmet>

      <KeywordList readOnly={!currentUser} gotoKeywordAdd={gotoKeywordAdd} />
    </>
  );
};

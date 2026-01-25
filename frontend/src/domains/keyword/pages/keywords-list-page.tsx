import { FC } from "react";
import { useSelector } from "../../../shared/services/store";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { KeywordList } from "../components/keyword-list/keyword-list";
import { useNavigate, useParams } from "react-router-dom";
import { genKeywordAddURL } from "../../../app/router/navigation";
import { Helmet } from "react-helmet-async";
import { useKeywordsList } from "../hooks/use-keywords-list";
import { Role } from "../../../features/auth/user-types";

/**
 * Страница список ключевых слов
 */
export const KeywordsListPage: FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { class_keyword_id } = useParams();
  const classKeywordId = class_keyword_id ? Number(class_keyword_id) : undefined;

  const gotoKeywordAdd = () => {
    navigate(genKeywordAddURL(class_keyword_id?Number(class_keyword_id):0));
  };

  const hookListRes =  useKeywordsList({gotoKeywordAdd,  classKeywordId});


  return (
    <>
      <Helmet>
        <title>Список ключевых слов</title>
      </Helmet>

      <KeywordList 
        readOnly={!currentUser || currentUser.role_id!==Role.User} 
        hookListRes={hookListRes}
      />
    </>
  );
};

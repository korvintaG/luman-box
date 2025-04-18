import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../../AppRoutes";
import { useSelector, useDispatch } from "../../services/store";
import { KeywordListUI } from "../../components/ui/list/keyword-list";
import {
  selectKeywords,
  fetchKeywords,
  selectIsDataLoading,
  clearCurrentKeyword,
} from "../../slices/keywords";
import { selectCurrentUser } from "../../slices/auth";

/**
 * Страница список ключевых слов
 */
export const KeywordsPage: FC = () => {
  const keywords = useSelector(selectKeywords);
  const isLoading = useSelector(selectIsDataLoading);
  const currentUser = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchKeywords());
  }, [dispatch]);

  const addNewKeyword = () => {
    dispatch(clearCurrentKeyword());
    navigate(appRoutes.keywordAdd);
  };

  return (
    <KeywordListUI
      keywords={keywords}
      readOnly={!currentUser}
      addNewKeyword={addNewKeyword}
      isLoading={isLoading}
    />
  );
};

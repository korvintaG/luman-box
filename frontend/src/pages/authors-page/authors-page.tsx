import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../../AppRoutes";
import { useSelector, useDispatch } from "../../services/store";
import {
  selectAuthors,
  fetchAuthors,
  selectIsDataLoading,
  clearCurrentAuthor,
} from "../../slices/authors";
import { AuthorListUI } from "../../components/ui/list/author-list";
import { selectCurrentUser } from "../../slices/auth";

/**
 * Страница список авторов
 */
export const AuthorsPage: FC = () => {
  const authors = useSelector(selectAuthors);
  const isLoading = useSelector(selectIsDataLoading);
  const currentUser = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addNewAuthor = () => {
    dispatch(clearCurrentAuthor());
    navigate(appRoutes.authorAdd);
  };

  useEffect(() => {
    dispatch(fetchAuthors());
  }, []);

  return (
    <AuthorListUI
      authors={authors}
      readOnly={!currentUser}
      addNewAuthor={addNewAuthor}
      isLoading={isLoading}
    />
  );
};

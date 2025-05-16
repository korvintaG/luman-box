import { FC } from "react";
import { useSelector } from "../../shared/services/store";
import { selectCurrentUser } from "../../features/auth/store/AuthSlice";
import { AuthorsList } from "../../features/authors/components/AuthorList";
import { useNavigate } from "react-router-dom";
import { genAuthorAddURL } from "../../app/router/navigation";

/**
 * Страница список авторов
 */
export const AuthorsListPage: FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate=useNavigate();

  const gotoAuthorAdd = () => {
    navigate(genAuthorAddURL)
  }

  return (
    <AuthorsList
      readOnly={!currentUser}
      gotoAuthorAdd={gotoAuthorAdd}
    />
  );
};

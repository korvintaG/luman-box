import { FC } from "react";
import { useSelector } from "../../../shared/services/store";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { AuthorList } from "../components/AuthorList/AuthorList";
import { useNavigate } from "react-router-dom";
import { genAuthorAddURL } from "../../../app/router/navigation";
import { Helmet } from "react-helmet-async";

/**
 * Страница список авторов
 */
export const AuthorListPage: FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const gotoAuthorAdd = () => {
    navigate(genAuthorAddURL);
  };
 
  return (
    <>
      <Helmet>
        <title>Список авторов</title>
      </Helmet>

      <AuthorList readOnly={!currentUser} gotoAuthorAdd={gotoAuthorAdd} />
    </>
  );
};

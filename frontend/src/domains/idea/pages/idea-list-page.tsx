import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "../../../shared/services/store";
import { IdeasList } from "../components/smart/IdeasList/IdeasList";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { genIdeaAddURL } from "../../../app/router/navigation";
import { Role } from "../../../features/auth/user-types";

/**
 * Страница список идей
 */
export const IdeasPage: FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [searchParams] = useSearchParams();
  const condSrc = searchParams.get("source_id");
  const condKw = searchParams.get("keyword_id");

  const navigate = useNavigate();

  const gotoIdeaAdd = () => {
    navigate(genIdeaAddURL);
  };

  return (
    <>
      <Helmet>
        <title>Список идей</title>
      </Helmet>

      <IdeasList
        readOnly={!currentUser || currentUser.role_id!==Role.User}
        gotoIdeaAdd={gotoIdeaAdd}
        condSrc={condSrc}
        condKw={condKw}
      />
    </>
  );
};

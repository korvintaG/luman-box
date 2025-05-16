import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useSelector } from "../../shared/services/store";
import { IdeasList } from "../../features/ideas/components/IdeaList/IdeasList";
import { selectCurrentUser } from "../../features/auth/store/AuthSlice";
import { genIdeaAddURL } from "../../app/router/navigation";

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
    navigate(genIdeaAddURL)
  }

  return (
    <IdeasList
      readOnly={!currentUser}
      gotoIdeaAdd={gotoIdeaAdd}
      condSrc={condSrc}
      condKw={condKw}
    />
  );
};

import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "../../shared/services/store";
import { appRoutes } from "../../app/router/AppRoutes";
import { selectCurrentUser } from "../../features/auth/store/AuthSlice";
import { IdeaDetails } from "../../features/ideas/components/IdeaDetails/IdeaDetails";

export const IdeaDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);
  const findSourceId = searchParams.get("source_id");
  const findKeywordId = searchParams.get("keyword_id");

  const afterSuccessDMLAction = () => {
    navigate(appRoutes.ideas)
  }

  return (
    <IdeaDetails
    id={id}
    currentUser={currentUser}
    findSourceId={findSourceId}
    findKeywordId={findKeywordId}
    afterSuccessDMLAction={afterSuccessDMLAction}
  />
  );
};

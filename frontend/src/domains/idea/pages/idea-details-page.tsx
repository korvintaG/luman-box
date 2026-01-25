import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "../../../shared/services/store";
import { appRoutesURL } from "../../../app/router/app-routes-URL";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { IdeaDetails } from "../components/smart/idea-details/idea-details";
import { generatePath } from "react-router";
import { genIdeaURL } from "../../../app/router/navigation";

export const IdeaDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);
  const findSourceId = searchParams.get("source_id");
  const findKeywordId = searchParams.get("keyword_id");

  const gotoIdeaList = () => {
    navigate(appRoutesURL.ideas);
  };

  const gotoIdea = (id: number) => {
    navigate(genIdeaURL(id));
  }

  return (
    <IdeaDetails
      id={id}
      currentUser={currentUser}
      findSourceId={findSourceId}
      findKeywordId={findKeywordId}
      gotoIdeaList={gotoIdeaList}
      gotoIdea={gotoIdea}
    />
  );
};

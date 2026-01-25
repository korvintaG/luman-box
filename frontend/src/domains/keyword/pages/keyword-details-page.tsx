import { useParams } from "react-router";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "../../../shared/services/store";
import { appRoutesURL } from "../../../app/router/app-routes-URL";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { KeywordDetails } from "../components/keyword-details/keyword-details";
import { generatePath } from "react-router";
import { useKeywordDetails } from "../hooks/use-keyword-details";
import { genKeywordURL } from "../../../app/router/navigation";

export const KeywordDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const keywordsModerationIdParam = searchParams.get("keywords_moderation_id");
  const keywordsModerationId = keywordsModerationIdParam ? Number(keywordsModerationIdParam) : undefined;
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const keywordDetailsHook = useKeywordDetails({
    id,
    currentUser,
    keywordsModerationId: keywordsModerationId
  });



  const gotoList = () => {
    navigate(generatePath(appRoutesURL.keywords,
      {class_keyword_id:keywordDetailsHook.record.currentRecord?.class_keyword_id??0}))
  }

  const gotoEdit = (id: number) => {
    navigate(genKeywordURL(id));
  }

  return (
    <KeywordDetails
    gotoList={gotoList}
    gotoEdit={gotoEdit}
    keywordDetailsHook={keywordDetailsHook}
  />
  );
};

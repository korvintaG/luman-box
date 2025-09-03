import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../../shared/services/store";
import { appRoutesURL } from "../../../app/router/AppRoutesURL";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { KeywordDetails } from "../components/KeywordDetails/KeywordDetails";
import { generatePath } from "react-router";
import { useKeywordDetails } from "../hooks/UseKeywordDetails";

export const KeywordDetailsPage = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const gotoList = () => {
    navigate(appRoutesURL.keywords)
  }

  const gotoEdit = (id: number) => {
    navigate(generatePath(appRoutesURL.keyword, id));
  }

  const keywordDetailsHook = useKeywordDetails({
    id,
    currentUser,
  });

  return (
    <KeywordDetails
    gotoList={gotoList}
    gotoEdit={gotoEdit}
    keywordDetailsHook={keywordDetailsHook}
  />
  );
};

import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../../shared/services/store";
import { appRoutesURL } from "../../../app/router/AppRoutesURL";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { KeywordDetails } from "../../../features/keywords/components/KeywordDetails/KeywordDetails";

export const KeywordDetailsPage = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const afterSuccessDMLAction = () => {
    navigate(appRoutesURL.keywords)
  }

  return (
    <KeywordDetails
    id={id}
    currentUser={currentUser}
    afterSuccessDMLAction={afterSuccessDMLAction}
  />
  );
};

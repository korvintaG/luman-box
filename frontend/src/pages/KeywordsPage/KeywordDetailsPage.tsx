import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../shared/services/store";
import { appRoutes } from "../../app/router/AppRoutes";
import { selectCurrentUser } from "../../features/auth/store/AuthSlice";
import { KeywordDetails } from "../../features/keywords/components/KeywordDetails/KeywordDetails";

export const KeywordDetailsPage = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const afterSuccessDMLAction = () => {
    navigate(appRoutes.keywords)
  }

  return (
    <KeywordDetails
    id={id}
    currentUser={currentUser}
    afterSuccessDMLAction={afterSuccessDMLAction}
  />
  );
};

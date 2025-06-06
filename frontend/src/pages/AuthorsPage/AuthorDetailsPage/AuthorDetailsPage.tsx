import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useSelector } from "../../../shared/services/store";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { appRoutesURL } from "../../../app/router/AppRoutesURL";
import { AuthorDetails } from "../../../features/authors/components/AuthorDetails/AuthorDetails"; 

export const AuthorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const afterSuccessDMLAction = () => {
    navigate(appRoutesURL.authors)
  }

  return <AuthorDetails
      id={id}
      currentUser={currentUser}
      afterSuccessDMLAction={afterSuccessDMLAction}
    />
 
};

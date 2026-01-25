import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useSelector } from "../../../shared/services/store";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { appRoutesURL } from "../../../app/router/app-routes-URL";
import { AuthorDetails } from "../components/AuthorDetails/AuthorDetails"; 
import { useAuthorDetails } from "../hooks/UseAuthorDetails";
import { generatePath } from "react-router";
import { genAuthorURL } from "../../../app/router/navigation";

export const AuthorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const gotoAuthorList = () => {
    navigate(appRoutesURL.authors)
  }
 
  const gotoAuthor = (id: number) => {
    navigate(genAuthorURL(id));
  }

  const authorDetailsHookRes = useAuthorDetails({
    id,
    currentUser,
  });


  return <AuthorDetails
      authorDetailsHookRes={authorDetailsHookRes}
      gotoAuthorList={gotoAuthorList}
      gotoAuthor={gotoAuthor}
    />
 
};

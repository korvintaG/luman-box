import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../shared/services/store";
import {
  selectAuthors,
} from '../../features/authors/store/AuthorSlice';
import { selectCurrentUser } from "../../features/auth/store/AuthSlice";
import { SourceDetails } from "../../features/sources/components/smart/SourceDetails/SourceDetails";
import { appRoutes } from "../../app/router/AppRoutes";

export const SourceDetailsPage = () => {
  const { id } = useParams();

  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const afterSuccessDMLAction = () => {
    navigate(appRoutes.sources)
  }

  return (
    <SourceDetails
      id={id}
      currentUser={currentUser}
      afterSuccessDMLAction={afterSuccessDMLAction}
    />
  );
};

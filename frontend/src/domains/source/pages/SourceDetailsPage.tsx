import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../../shared/services/store";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { SourceDetails } from "../components/smart/SourceDetails/SourceDetails";
import { appRoutesURL } from "../../../app/router/AppRoutesURL";
import { useSourceDetails } from "../hooks/UseSourceDetails";
import { generatePath } from "react-router";
import { genSourceURL } from "../../../app/router/navigation";

export const SourceDetailsPage = () => {
  const { id } = useParams();

  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const gotoSourceList = () => {
    navigate(appRoutesURL.sources)
  }

  const gotoSource = (id: number) => {
    console.log('gotoSource id=', id)
    navigate(genSourceURL(id));
  }

  const sourceDetailsHookRes = useSourceDetails({
    id,
    currentUser,
  });

  return (
    <SourceDetails
      sourceDetailsHookRes={sourceDetailsHookRes}
      gotoSourceList={gotoSourceList}
      gotoSource={gotoSource}
    />
  );
};

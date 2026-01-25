import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../../shared/services/store";
import { appRoutesURL } from "../../../app/router/app-routes-URL";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { KeywordDetails } from "../components/keyword-details/keyword-details";
import { generatePath } from "react-router";
import { useKeywordDetails } from "../hooks/use-keyword-details";
import { genKeywordURL } from "../../../app/router/navigation";
import { KeywordAdd } from "../components/keyword-add/keyword-add";
import { useKeywordDetailsAdd } from "../hooks/use-keyword-add";

export const KeywordAddPage = () => {
  const { class_keyword_id } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const gotoList = () => {
    navigate(generatePath(appRoutesURL.keywords,{class_keyword_id:class_keyword_id?Number(class_keyword_id):0}))
  }

  const gotoEdit = (id: number) => {
    navigate(genKeywordURL(id));
  }

  const keywordAddDetailsHook = useKeywordDetailsAdd({
    class_keyword_id,
    currentUser,
  });

  return (
    <KeywordAdd
    gotoList={gotoList}
    gotoEdit={gotoEdit}
    keywordAddDetailsHook={keywordAddDetailsHook}
  />
  );

};

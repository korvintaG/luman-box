import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ErrorMessageUI } from "../../shared/ui/ErrorMessage/ErrorMessage";
import { useSelector } from "../../shared/services/store";
import { selectCurrentUser } from "../../features/auth/store/AuthSlice";
import { genInterconnectionsURL } from "../../app/router/navigation";
import { InterconnectionDetailsAdd } from "../../features/interconnections/components/smart/InterconnectionDetailsAdd/InterconnectionDetailsAdd";
import { interconnectionsTypeInfo } from "../../shared/constants/InterconnectionTypeInfo";

export const InterconnectionDetailsAddPage = () => {
    const {idea_id, iitype_id } = useParams();
    const [searchParams] = useSearchParams();
    const isReverse = searchParams.get("is_reverse");
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    if (!idea_id || !iitype_id)
      return <ErrorMessageUI
        error={`Неправильные параметры idea_id=${idea_id}, iitype_id=${iitype_id}`}
        />

    const found= interconnectionsTypeInfo.find(el=>el.id===Number(iitype_id));
    if (!found) 
      return <ErrorMessageUI
        error={`Не найден тип взаимосвзяи=${iitype_id}`}
        />

    const afterSuccessDMLAction = () => {
      navigate(genInterconnectionsURL(Number(idea_id), Number(iitype_id)))
    }

return <InterconnectionDetailsAdd
  idea_id={idea_id}
  iitype_id={iitype_id}
  currentUser={currentUser}
  afterSuccessDMLAction={afterSuccessDMLAction}
  isReverse={!!isReverse}
  interconnectionTypeInfo={found}
/>

}


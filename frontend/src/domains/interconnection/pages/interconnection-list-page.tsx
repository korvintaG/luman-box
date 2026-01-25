import { useParams } from "react-router";
import { useNavigate,generatePath } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { interconnectionsTypeInfo } from "../../../shared/constants/InterconnectionTypeInfo"; 
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { genInterconnectionAddURL } from "../../../app/router/navigation";
import { ErrorMessageUI } from "../../../shared/ui/ErrorMessage/ErrorMessage";
import { InterconnectionList } from "../components/smart/InterconnectionList/InterconnectionList";
import { Role } from "../../../features/auth/user-types";
  

export const InterconnectionsPage = () => {
  const { idea_id, iitype_id } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  if (!idea_id || !iitype_id)
    return <ErrorMessageUI 
        error='Не определены параметры страницы'
      />

  const gotoInterconnectionAdd = (isReverse:boolean) => {
    navigate(genInterconnectionAddURL(Number(idea_id), Number(iitype_id),isReverse))
  }

  const found=interconnectionsTypeInfo.find(el=>el.id===Number(iitype_id));
  if (found)
        return <InterconnectionList
            readOnly={!currentUser || currentUser.role_id!==Role.User}
            gotoInterconnectionAdd={gotoInterconnectionAdd}
            interconnectionTypeInfo={found}
            idea_id={Number(idea_id)}
            iitype_id={Number(iitype_id)}
        />;

        /*return <IdeaInterconnectionListUI
            interconnections={interconnections}
            interconnectionTypeInfo={found}
            genIdeaURL={genIdeaURL}
            genSourceURL={genSourceURL}
            genInterconnectionURL={genInterconnectionURL}
            getInterconnectionAddURL={getInterconnectionAddURL}
            addNewInterconnection={addNewInterconnection}
        />;*/

    return <ErrorMessageUI 
        error={`Не найден указанный тип взаимосвязи = ${iitype_id}`}
      />

}
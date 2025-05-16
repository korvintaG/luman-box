import { useParams } from "react-router";
import {   useNavigate, useSearchParams } from "react-router-dom";
import {  FC } from "react";
import { useSelector } from "../../shared/services/store";
import { selectCurrentUser } from "../../features/auth/store/AuthSlice";
import { genInterconnectionsURL } from "../../app/router/navigation";
import { ErrorMessageUI } from "../../shared/ui/ErrorMessage/ErrorMessage";
import { InterconnectionDetailsEdit } from "../../features/interconnections/components/InterconnectionDetailsEdit/InterconnectionDetailsEdit";


export const InterconnectionDetailsEditPage: FC = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isReverse = searchParams.get("is_reverse");
    //console.log('InterconnectionDetails isReverse',isReverse);

    
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();
    if (!id) {
      return <ErrorMessageUI error={`Неправильные параметры id=${id}`} />;
    }


    const afterSuccessDMLAction = (idea_id: number, iitype_id: number) => {
      navigate(genInterconnectionsURL(idea_id,iitype_id))
    }
  


return <InterconnectionDetailsEdit
  id={id}
  currentUser={currentUser}
  afterSuccessDMLAction={afterSuccessDMLAction}
  isReverse={!!isReverse}
/>

}

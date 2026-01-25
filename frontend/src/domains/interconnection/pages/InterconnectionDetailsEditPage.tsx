import { useParams } from "react-router";
import {   useNavigate, useSearchParams } from "react-router-dom";
import {  FC } from "react";
import { useSelector } from "../../../shared/services/store";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { genInterconnectionsURL, genInterconnectionURL } from "../../../app/router/navigation";
import { ErrorMessageUI } from "../../../shared/ui/ErrorMessage/ErrorMessage";
import { InterconnectionDetailsEdit } from "../components/smart/InterconnectionDetailsEdit/InterconnectionDetailsEdit";
import { generatePath } from "react-router";
import { appRoutesURL } from "../../../app/router/app-routes-URL";
import { useInterconnectionDetailsEdit } from "../hooks/UseInterconnectionDetailsEdit";


export const InterconnectionDetailsEditPage: FC = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isReverse = searchParams.get("is_reverse");
    //console.log('InterconnectionDetails isReverse',isReverse);

    
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();
    const interconnectionDetailsHook = useInterconnectionDetailsEdit({
      id,
      currentUser,
    });

    if (!id) {
      return <ErrorMessageUI error={`Неправильные параметры id=${id}`} />;
    }

  


    const gotoList = () => {
      let idea_id = 0;
      if (isReverse) {
        idea_id = interconnectionDetailsHook.record!.currentRecord!.idea2_id;
      } else {
        idea_id = interconnectionDetailsHook.record!.currentRecord!.idea1_id;
      }
      const iitype_id = interconnectionDetailsHook.record!.currentRecord!.interconnection_type;
      navigate(genInterconnectionsURL(idea_id,iitype_id))
    }

    const gotoEdit = (id: number) => {
      navigate(genInterconnectionURL(id, !!isReverse ));
    }


return <InterconnectionDetailsEdit
  gotoList={gotoList}
  gotoEdit={gotoEdit}
  interconnectionDetailsHook={interconnectionDetailsHook}
/>

}

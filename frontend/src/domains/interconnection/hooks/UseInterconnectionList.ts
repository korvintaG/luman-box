import { useSelector, useDispatch } from "../../../shared/services/store";
import {
    selectSliceState,
    selectInterconnections,
    fetchInterconnections,
    
    selectError
  } from "../store/interconnection-list-slice";

import { clearCurrentInterconnection } from "../store/interconnection-add-slice";

export type useInterconnectionsListProps = {
    gotoInterconnectionAdd:(isReverse: boolean)=>void,
    idea_id:number;
    iitype_id:number;
}

export const useInterconnectionList = (
  {gotoInterconnectionAdd, idea_id, iitype_id}:useInterconnectionsListProps)  => {

    const dispatch = useDispatch();    
    const interconnections =  useSelector(selectInterconnections);
    const sliceState = useSelector(selectSliceState)
    const error = useSelector(selectError)

    const fetchRecords = () =>{
      dispatch(
        fetchInterconnections({
          idea_id: String(idea_id),
          iitype_id: String(iitype_id),
        }),
      );
    }
  

    const addNewInterconnection = (isReverse: boolean) => {
      dispatch(clearCurrentInterconnection());
      gotoInterconnectionAdd(isReverse)
  };

  /*useEffect(() => {
    fetchRecords()
  }, [idea_id]);*/

  return {interconnections, sliceState, error, addNewInterconnection, fetchRecords}
}

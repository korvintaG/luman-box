import { SyntheticEvent } from "react";
import { useForm } from "../../../shared/hooks/useForm"; 
import { useSelector, useDispatch } from "../../../shared/services/store";
import { fetchCurrentIdea, selectError, selectSliceState, addInterconnection, 
  selectInterconnectionAdd, fetchIdeaToSet, selectFindError, resetFoundData, setUpdateError,
  setSliceStatus,
  selectNewID, 
   } 
from "../store/interconnection-add-slice";
import { DetailsHookProps, IDetailsAddHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";
import { InterconnectionAddForm, InterconnectionTypeInfo } from "../types/UI-types";
import { InterconnectionAdd, InterconnectionDetailAttachments } from "../types/entity-types";


export interface DetailsAddHookProps extends DetailsHookProps {
  isReverse: boolean;
  idea_id: string;
  iitype_id: string;
  interconnectionTypeInfo:InterconnectionTypeInfo;
}

export interface DetailsAddHookRes<FormValues, Record> extends
  IDetailsAddHookRes<FormValues, Record> {
    status: IDetailsAddHookRes<FormValues, Record>['status'] & {
      resetSliceState:()=>void;
    }
    find: {
      findIdeaToAddByID: (e: SyntheticEvent) => void;
      errorFind: string;
      resetFoundData: ()=>void;
    }
}

export const useInterconnectionDetailsAdd = (
  {interconnectionTypeInfo : iti, currentUser, isReverse, idea_id, iitype_id}: DetailsAddHookProps)
  :DetailsAddHookRes<InterconnectionAddForm,InterconnectionDetailAttachments>     =>{

  const { values, handleChange, setValues, getFormDTO, editStarted, setEditStarted } = useForm<InterconnectionAddForm>({
        name_direct:'',
        name_reverse:'',
        idea_id: null
      });
  const currentRecord = useSelector(selectInterconnectionAdd)
  const errorText = useSelector(selectError)
  const errorFindText = useSelector(selectFindError)
  const sliceState = useSelector(selectSliceState)
  const newID = useSelector(selectNewID)
  const dispatch = useDispatch();   
    
  const fetchRecord = ()=>{
    dispatch(fetchCurrentIdea(Number(idea_id)));
  }

  const resetSliceStateAction =()=>{
    dispatch(setSliceStatus(RequestStatus.Idle));
  }
      
  const resetFoundDataAction = ()=>{
    dispatch(resetFoundData())
  }
  
  const findIdeaToAddByID=(e: SyntheticEvent)=>{
    e.preventDefault();
    if (values.idea_id)
      dispatch(fetchIdeaToSet(Number(values.idea_id)));
  }

  const handleSubmitAction = (e: SyntheticEvent) => {
    e.preventDefault();
    if (values.idea_id && currentRecord && currentRecord.idea_interconnect && currentRecord.idea_current) {
      if (values.name_direct.length>=10 && values.name_reverse.length>=10) {
        const addObj:InterconnectionAdd  = { 
          idea1_id : isReverse?Number(values.idea_id) :currentRecord.idea_current.id, 
          interconnection_type:  iti.id,
          idea2_id:isReverse?currentRecord.idea_current.id:Number(values.idea_id),
          name_direct: isReverse?values.name_reverse:values.name_direct,
          name_reverse: isReverse?values.name_direct:values.name_reverse,
          moderation_notes: null
          };
        dispatch(addInterconnection(addObj));
      }
      else 
        dispatch(setUpdateError('Комментарий к связи должен быть длиной от 10-ти символов!'))
    }
    else {
      dispatch(setUpdateError('Не указана идея для связывания!'))

    }
  };    

  return {
    form: {
      values,
      handleChange,
      setValues,
      editStarted,
      setEditStarted
    },
    record: {
      newID: newID,
      fetchRecord,
      currentRecord,
      handleSubmitAction
    },
    status: {
      sliceStates:[sliceState],
      errorText,
      resetSliceState:resetSliceStateAction
    }, 
    find: {
      findIdeaToAddByID,
      errorFind: errorFindText,
      resetFoundData:resetFoundDataAction
    }
  }

}

import { useEffect, SyntheticEvent } from "react";
import { useForm } from "../../../shared/hooks/useForm"; 
import { InterconnectionAddData, InterconnectionAddForm, InterconnectionCreateDTO, 
   InterconnectionTypeInfo} 
from "../InterconnectionTypes";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { fetchCurrentIdea, selectError, selectSliceState, addInterconnection, 
  selectInterconnectionAdd, fetchIdeaToSet, selectFindError, resetFoundData, setUpdateError, resetSliceState } 
from "../store/InterconnectionSlice";
import { DetailsHookProps, IDetailsAddHookRes } from "../../../shared/common-types";
import { IdeaForList } from "../../ideas/IdeaTypes";


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
  :DetailsAddHookRes<InterconnectionAddForm,InterconnectionAddData>     =>{

  const { values, handleChange, setValues, getFormDTO } = useForm<InterconnectionAddForm>({
        nameDirect:'',
        nameReverse:'',
        ideaID: null
      });
  const currentRecord = useSelector(selectInterconnectionAdd)
  const errorText = useSelector(selectError)
  const errorFindText = useSelector(selectFindError)
  const sliceState = useSelector(selectSliceState)
  const dispatch = useDispatch();   
    
  const fetchRecord = ()=>{
    dispatch(fetchCurrentIdea(Number(idea_id)));
  }

  const resetSliceStateAction =()=>{
    dispatch(resetSliceState());
  }
      
  useEffect(() => {
    fetchRecord();
  }, [idea_id]);

  const resetFoundDataAction = ()=>{
    dispatch(resetFoundData())
  }
  
  const findIdeaToAddByID=(e: SyntheticEvent)=>{
    e.preventDefault();
    if (values.ideaID)
      dispatch(fetchIdeaToSet(Number(values.ideaID)));
  }

  const handleSubmitAction = (e: SyntheticEvent) => {
    e.preventDefault();
    if (values.ideaID && currentRecord && currentRecord.ideaInterconnect && currentRecord.ideaCurrent) {
      if (values.nameDirect.length>=10 && values.nameReverse.length>=10) {
        const addObj:InterconnectionCreateDTO  = { 
          idea1_id : isReverse?Number(values.ideaID) :currentRecord.ideaCurrent.id, 
          interconnection_type:  iti.id,
          idea2_id:isReverse?currentRecord.ideaCurrent.id:Number(values.ideaID),
          name_direct: isReverse?values.nameReverse:values.nameDirect,
          name_reverse: isReverse?values.nameDirect:values.nameReverse,
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
      handleChange
    },
    record: {
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

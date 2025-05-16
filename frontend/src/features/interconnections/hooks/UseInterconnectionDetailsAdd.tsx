import { useEffect, SyntheticEvent } from "react";
import { useForm } from "../../../shared/hooks/useForm"; 
import { InterconnectionAddData, InterconnectionAddForm, InterconnectionCreateDTO, 
   InterconnectionTypeInfo} 
from "../InterconnectionTypes";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { fetchCurrentIdea, selectError, selectSliceState, addInterconnection, 
  selectInterconnectionAdd, fetchIdeaToSet, selectFindError, resetFoundData } 
from "../store/InterconnectionSlice";
import { DetailsHookProps, IDetailsHookRes, RequestStatus } from "../../../shared/common-types";
import { IdeaForList } from "../../ideas/IdeaTypes";
import { InterconnectionEditData } from "../InterconnectionTypes";
import { EditAccessStatus, getEditAccess } from "../../../shared/utils/utils";


export interface DetailsAddHookProps extends DetailsHookProps {
  isReverse: boolean;
  idea_id: string;
  iitype_id: string;
  interconnectionTypeInfo:InterconnectionTypeInfo;
}

export interface DetailsAddHookRes<FormValues, Record> extends
  IDetailsHookRes<FormValues, Record> {
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
        
    useEffect(() => {
      fetchRecord();
    }, [idea_id]);

    const resetFoundDataAction = ()=>{
      dispatch(resetFoundData())
    }
    
    const deleteRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
    };

    const approveRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
    };
   
    const rejectRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
    };


    const findIdeaToAddByID=(e: SyntheticEvent)=>{
      e.preventDefault();
      if (values.ideaID)
        dispatch(fetchIdeaToSet(Number(values.ideaID)));
    }

    const handleSubmitAction = (e: SyntheticEvent) => {
      e.preventDefault();
      if (values.ideaID && currentRecord && currentRecord.ideaCurrent) {
        const addObj:InterconnectionCreateDTO  = { 
          idea1_id : isReverse?Number(values.ideaID) :currentRecord.ideaCurrent.id, 
          interconnection_type:  iti.id,
          idea2_id:isReverse?currentRecord.ideaCurrent.id:Number(values.ideaID),
          name_direct: isReverse?values.nameReverse:values.nameDirect,
          name_reverse: isReverse?values.nameDirect:values.nameReverse,
          };
        dispatch(addInterconnection(addObj));
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
        deleteRecordAction, 
        handleSubmitAction
      },
      status: {
        sliceStates:[sliceState],
        errorText,
        editAccessStatus: EditAccessStatus.Editable
      }, 
      moderate:{
         approveRecordAction, rejectRecordAction 
      },
      find: {
       findIdeaToAddByID,
       errorFind: errorFindText,
       resetFoundData:resetFoundDataAction
      }
    }

}

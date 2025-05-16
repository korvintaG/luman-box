import { useEffect, SyntheticEvent } from "react";
import { useForm } from "../../../shared/hooks/useForm"; 
import { InterconnectionAddData, InterconnectionAddForm, InterconnectionCreateDTO, InterconnectionEditForm, InterconnectionTypeInfo, InterconnectionUpdateDTO } 
from "../InterconnectionTypes";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { fetchCurrentIdea, selectError, selectSliceState, addInterconnection, selectInterconnectionAdd, fetchInterconnection, setInterconnection, fetchIdeaToSet, selectFindError } 
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
    findIdeaToAddByID: (e: SyntheticEvent) => void;
    errorFind: string;
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

    /*useEffect(() => {
      if (currentIdea)
        setValues({ ...values,currentIdea});
    }, [currentIdea]);
    */
   /* useEffect(() => {
      if (currentRecord) {
        setValues({ 
          ...values,
          interconnectionTypeID:currentRecord.interconnection_type,
          nameDirect:currentRecord.name_direct,
          nameReverse:currentRecord.name_reverse,
          interconnectionIdea:{
            id:currentRecord.ideaInterconnect.id,
            name:currentRecord.ideaInterconnect.name
          },
          currentIdea:{
            id:currentRecord.ideaCurrent.id,
            name:currentRecord.ideaCurrent.name
          }});
      }
    }, [currentRecord]);*/
    
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
       findIdeaToAddByID,
       errorFind: errorFindText
    }

}

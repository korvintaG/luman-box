import { useEffect, SyntheticEvent } from "react";
import { useForm } from "../../../shared/hooks/useForm"; 
import { useSelector, useDispatch } from "../../../shared/services/store";
import { selectError, selectSliceState, selectInterconnectionEdit, 
  fetchInterconnection, setInterconnection, delInterconnection, approveInterconnection, setUpdateError, 
  rejectInterconnection,
  toModerateInterconnection,
  setSliceStatus} 
from "../store/interconnection-edit-slice";
import { DetailsHookProps, IDetailsEditHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";
import { getEditAccess } from "../../../shared/utils/utils";
import { InterconnectionUpdateForm } from "../types/UI-types";
import { InterconnectionDetail } from "../types/entity-types";

export const useInterconnectionDetailsEdit = (
  {id, currentUser}: DetailsHookProps)
  :IDetailsEditHookRes<InterconnectionUpdateForm,InterconnectionDetail> =>{

  const { values, handleChange, setValues, getFormDTO, editStarted, setEditStarted } = useForm<InterconnectionUpdateForm>({
        name_direct:'',
        name_reverse:'',
        id:0,
        moderation_notes: null
      });
    const currentRecord = useSelector(selectInterconnectionEdit)
    const errorText = useSelector(selectError)
    const sliceState = useSelector(selectSliceState)
    const dispatch = useDispatch();   
    const editAccessStatus = getEditAccess(id, currentUser, currentRecord)
    //console.log('useInterconnectionDetailsEdit editAccessStatus ',currentRecord)
     
    const fetchRecord = ()=>{ 
      dispatch(fetchInterconnection(Number(id)));
    }
        
    useEffect(() => {
      if (currentRecord) {
        setValues({ 
          ...values,
          name_direct:currentRecord.name_direct,
          name_reverse:currentRecord.name_reverse
        });

      }
    }, [currentRecord]);

    const resetSlicesStatus = ()=>{
      dispatch(setSliceStatus(RequestStatus.Idle));
    }
    
    const deleteRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(delInterconnection(Number(id)));
    };

    const approveRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(approveInterconnection({id: Number(id), notes: values.moderation_notes || ""}));
    };
   
    const rejectRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(rejectInterconnection({id: Number(id), notes: values.moderation_notes || ""}));
    };

    const toModerateRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(toModerateInterconnection(Number(id)));
    };

    const handleSubmitAction = (e: SyntheticEvent) => {
      e.preventDefault();
      if (values.name_direct.length>=10 && values.name_reverse.length>=10) {
        const upObj:InterconnectionUpdateForm = {
          id:Number(id),
          name_direct: values.name_direct,
          name_reverse: values.name_reverse,
          moderation_notes: null
        }
        dispatch(setInterconnection(upObj));
      }
      else 
        dispatch(setUpdateError('Комментарий к связи должен быть длиной от 10-ти символов!'))

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
        id: id?Number(id): undefined,
        fetchRecord,
        currentRecord,
        deleteRecordAction, 
        handleSubmitAction
      },
      status: {
        sliceStates:[sliceState],
        errorText, 
        editAccessStatus,
        resetSlicesStatus
      }, 
      moderate:{
         approveRecordAction, rejectRecordAction, toModerateRecordAction
      },
    }
    
}
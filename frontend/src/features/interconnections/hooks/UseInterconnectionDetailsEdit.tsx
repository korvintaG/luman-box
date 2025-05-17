import { useEffect, SyntheticEvent } from "react";
import { useForm } from "../../../shared/hooks/useForm"; 
import { InterconnectionCreateDTO, InterconnectionEditForm, InterconnectionTypeInfo, InterconnectionUpdateDTO } 
from "../InterconnectionTypes";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { fetchCurrentIdea, selectError, selectSliceState, selectInterconnectionEdit, 
  fetchInterconnection, setInterconnection, delInterconnection, approveInterconnection, setUpdateError } 
from "../store/InterconnectionSlice";
import { DetailsHookProps, IDetailsEditHookRes } from "../../../shared/common-types";
import { IdeaForList } from "../../ideas/IdeaTypes";
import { InterconnectionEditData } from "../InterconnectionTypes";
import { getEditAccess } from "../../../shared/utils/utils";
import { interconnectionsTypeInfo } from "../../../shared/constants/InterconnectionTypeInfo";

export const useInterconnectionDetailsEdit = (
  {id, currentUser}: DetailsHookProps)
  :IDetailsEditHookRes<InterconnectionEditForm,InterconnectionEditData> =>{

  const { values, handleChange, setValues, getFormDTO } = useForm<InterconnectionEditForm>({
        //interconnectionTypeID: undefined,
        nameDirect:'',
        nameReverse:'',
        //interconnectionIdea:{id:0,name:'',source_id:0, source_name:''},
        //currentIdea:{id:0,name:'',source_id:0, source_name:''},
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
      fetchRecord();
    }, [id]);

    
    useEffect(() => {
      if (currentRecord) {
        setValues({ 
          ...values,
          nameDirect:currentRecord.name_direct,
          nameReverse:currentRecord.name_reverse
        });

      }
    }, [currentRecord]);
    
    const deleteRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(delInterconnection(Number(id)));
    };

    const approveRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(approveInterconnection(Number(id)));
    };
   
    const rejectRecordAction = (e: SyntheticEvent) => {
      e.preventDefault();
    };


    const handleSubmitAction = (e: SyntheticEvent) => {
      e.preventDefault();
      if (values.nameDirect.length>=10 && values.nameReverse.length>=10) {
        const upObj:InterconnectionUpdateDTO = {
          id:Number(id),
          name_direct: values.nameDirect,
          name_reverse: values.nameReverse,
        }
        dispatch(setInterconnection(upObj));
      }
      else 
        dispatch(setUpdateError('Комментарий к связи должен быть длиной от 10-ти символов!'))

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
        editAccessStatus
      }, 
      moderate:{
         approveRecordAction, rejectRecordAction 
      },
    }

    
}

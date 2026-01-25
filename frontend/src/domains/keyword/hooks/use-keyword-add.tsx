import { SyntheticEvent } from "react";
import { useForm } from "../../../shared/hooks/useForm"; 
import { useSelector, useDispatch } from "../../../shared/services/store";
import {  selectError, selectSliceState, 
  setUpdateError,
  setSliceStatus,
  selectNewID,
  selectFindError,
  fetchKeywordSummary,
  addKeyword,
  selectKeywordSummary,
   } 
from "../store/keyword-add-slice";
import { DetailsHookProps, IDetailsAddHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";
import { DetailsAddHookRes } from "../../interconnection/hooks/UseInterconnectionDetailsAdd";
import { KeywordAdd, KeywordDetail, KeywordSummary } from "../types/keyword-types";


export interface DetailsAddHookProps extends DetailsHookProps {
  class_keyword_id?: string;
  addedKeyword?: KeywordAdd;
}


export const useKeywordDetailsAdd = (
  {class_keyword_id, addedKeyword, currentUser}: DetailsAddHookProps)
  :IDetailsAddHookRes<KeywordAdd,KeywordSummary>     =>{

    const { values, handleChange, setValues, getFormDTO, getFormDTOObl, editStarted, 
      setEditStarted, setFieldValueDirect } = useForm<KeywordAdd>({
      name: "",
      definition:"",
      class_keyword_id: 0,
      names: []
    });
  

  const currentRecord = useSelector(selectKeywordSummary)
  const errorText = useSelector(selectError)
  const errorFindText = useSelector(selectFindError)
  const sliceState = useSelector(selectSliceState)
  const newID = useSelector(selectNewID)
  const dispatch = useDispatch();   
    
  const fetchRecord = ()=>{
    dispatch(fetchKeywordSummary(Number(class_keyword_id)));
  }

  const resetSliceStateAction =()=>{
    dispatch(setSliceStatus(RequestStatus.Idle));
  }
      
  const handleSubmitAction = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('handleSubmitAction')
    if (values.names && values.names.length>0  && values.default_name_index !== undefined) {
      console.log('Пытаемся добавить ключевое слово на сервере')
      const addedDTO:KeywordAdd={
        names: values.names.filter(el=>el),
        definition: values.definition,
        class_keyword_id: class_keyword_id ? Number(class_keyword_id) : 0,
        default_name_index:values.default_name_index, 
        name: values.names[values.default_name_index]
      }
      dispatch(addKeyword(addedDTO));
    }
  };    

  return {
    form: {
      values,
      handleChange,
      setValues,
      editStarted,
      setEditStarted,
      setFieldValueDirect
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
    }
  }
}

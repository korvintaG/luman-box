import { useEffect, SyntheticEvent } from "react";
import { useSelector, useDispatch } from "../../../shared/services/store";
import {
  setKeyword,
  selectCurrentKeyword,
  delKeyword,
  selectError,
  approveKeyword,
  rejectKeyword,
  getKeyword,
  addKeyword,
  selectSliceState,
  toModerateKeyword,
  setSliceStatus,
  selectNewID,
} from "../store/KeywordDetailSlice";
import { useForm } from "../../../shared/hooks/useForm"; 
import { pick } from "lodash";
import {
  getEditAccess
  
} from "../../../shared/utils/utils";
import { KeywordAdd, KeywordDetail } from "../types/KeywordTypes";
import { DetailsHookProps, IDetailsEditHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";



export const useKeywordDetails = ({id, currentUser}: DetailsHookProps)
  : IDetailsEditHookRes<KeywordAdd, KeywordDetail> => {
  const { values, handleChange, setValues, getFormDTO, getFormDTOObl, editStarted, setEditStarted } = useForm<KeywordAdd>({
    name: "",
    definition:"",
    moderation_notes: null
  });

  const dispatch = useDispatch();
  const sliceState = useSelector(selectSliceState);
  const errorText = useSelector(selectError);
  const currentRecord = useSelector(selectCurrentKeyword);
  const editAccessStatus = getEditAccess(id, currentUser, currentRecord)
  const newID = useSelector(selectNewID);

  const fetchRecord = () => {
    if (id) dispatch(getKeyword(Number(id)));
  };


  /*useEffect(() => fetchRecord(), []);*/

  useEffect(() => {
    if (currentRecord)
      setValues({
        ...pick(currentRecord, ["name", "definition", "moderation_notes"]),
      });
  }, [currentRecord]);

  const deleteRecordAction = (e: SyntheticEvent) => {
    dispatch(delKeyword(Number(id)));
  };

  const resetSlicesStatus = ()=>{
    dispatch(setSliceStatus(RequestStatus.Idle));
  }


  const toModerateRecordAction = (e: SyntheticEvent) => {
    dispatch(toModerateKeyword(Number(id)));
  };

  const approveRecordAction = (e: SyntheticEvent) => {
    dispatch(approveKeyword({id: Number(id), notes: values.moderation_notes || ""}));
  };

  const rejectRecordAction = (e: SyntheticEvent) => {
    dispatch(rejectKeyword({id: Number(id), notes: values.moderation_notes || ""}));
  };

  const handleSubmitAction = (e: SyntheticEvent) => {
    //console.log('useKeywordDetails','handleSubmitAction id=',id)
    e.preventDefault();
    if (id) {
      const newo = { ...getFormDTO(), id: Number(id) };
      //console.log('useKeywordDetails','handleSubmitAction newo=',newo)
      dispatch(setKeyword(newo));
    }
    else dispatch(addKeyword({ ...getFormDTOObl() }));
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
      newID,
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
    }
  }

};

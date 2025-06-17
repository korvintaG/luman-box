import { useEffect, SyntheticEvent } from "react";
import { useSelector, useDispatch } from "../../../shared/services/store";
import {
  setKeyword,
  selectCurrentKeyword,
  delKeyword,
  selectError,
  setStateSuccess,
  approveKeyword,
  rejectKeyword,
  getKeyword,
  addKeyword,
  selectSliceState,
} from "../store/KeywordSlice";
import { useForm } from "../../../shared/hooks/useForm"; 
import { pick } from "lodash";
import {
  getEditAccess
  
} from "../../../shared/utils/utils";
import { Keyword, KeywordInner } from "../KeywordTypes";
import { DetailsHookProps, IDetailsEditHookRes } from "../../../shared/common-types";



export const useKeywordDetails = ({id, currentUser}: DetailsHookProps)
  : IDetailsEditHookRes<KeywordInner, Keyword> => {
  const { values, handleChange, setValues, getFormDTO } = useForm<KeywordInner>({
    name: "",
    definition:""
  });

  const dispatch = useDispatch();
  const sliceState = useSelector(selectSliceState);
  const errorText = useSelector(selectError);
  const currentRecord = useSelector(selectCurrentKeyword);
  const editAccessStatus = getEditAccess(id, currentUser, currentRecord)

  const fetchRecord = () => {
    if (id) dispatch(getKeyword(Number(id)));
  };


  /*useEffect(() => fetchRecord(), []);*/

  useEffect(() => {
    if (currentRecord)
      setValues({
        ...pick(currentRecord, ["name", "definition"]),
      });
  }, [currentRecord]);

  const deleteRecordAction = (e: SyntheticEvent) => {
    dispatch(delKeyword(Number(id)));
  };

  const approveRecordAction = (e: SyntheticEvent) => {
    dispatch(approveKeyword(Number(id)));
  };

  const rejectRecordAction = (e: SyntheticEvent) => {
    dispatch(rejectKeyword(Number(id)));
  };

  const handleSubmitAction = (e: SyntheticEvent) => {
    //console.log('useKeywordDetails','handleSubmitAction id=',id)
    e.preventDefault();
    if (id) {
      const newo = { ...getFormDTO(), id: Number(id) };
      //console.log('useKeywordDetails','handleSubmitAction newo=',newo)
      dispatch(setKeyword(newo));
    }
    else dispatch(addKeyword({ ...getFormDTO() }));
  };

  return {
    form: {
      values,
      handleChange,
      setValues
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
    }
  }

};

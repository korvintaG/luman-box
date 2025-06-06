import { useEffect } from "react";
import { useSelector, useDispatch } from "../../../shared/services/store";
import {
  selectKeywords,
  fetchKeywords,
  clearCurrentKeyword,
  selectError,
  selectSliceState,
} from "../store/KeywordSlice";

export const useKeywordsList = (gotoKeywordAdd: ()=>void) => {
  const keywords = useSelector(selectKeywords);
  const sliceState = useSelector(selectSliceState);
  const error = useSelector(selectError)

  const dispatch = useDispatch();
  
  const fetchRecords = () =>{
    dispatch(fetchKeywords());
  }

  /*useEffect(() => {
    fetchRecords();
  }, [dispatch]);*/

  const addNewKeyword = () => {
    dispatch(clearCurrentKeyword());
    gotoKeywordAdd();
  };

  return {keywords, sliceState, error, addNewKeyword, fetchRecords}
};

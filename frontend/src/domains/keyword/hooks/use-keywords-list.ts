import { useSelector, useDispatch } from "../../../shared/services/store";
import {
  selectKeywords,
  selectError,
  selectSliceState,
  fetchKeywords,
} from "../store/keyword-list-slice";

import { clearCurrentKeyword } from "../store/keyword-detail-slice";
import { KeywordList } from "../types/keyword-types";
import { RequestStatus } from "../../../shared/types/types-for-hooks";

export type useKeywordsListPars = {
  gotoKeywordAdd: ()=>void
  classKeywordId?:number
}

export type useKeywordsListRes = {
  keywords?:  KeywordList,
  sliceState: RequestStatus, 
  error: string, 
  addNewKeyword: ()=>void, 
  fetchRecords: ()=>void
}

export const useKeywordsList = ({gotoKeywordAdd, classKeywordId} : useKeywordsListPars) => {
  const keywords = useSelector(selectKeywords);
  const sliceState = useSelector(selectSliceState);
  const error = useSelector(selectError)

  const dispatch = useDispatch();
  
  const fetchRecords = () =>{
    dispatch(fetchKeywords({class_id: classKeywordId?String(classKeywordId):"0"}));
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

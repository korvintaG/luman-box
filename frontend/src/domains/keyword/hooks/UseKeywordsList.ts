import { useSelector, useDispatch } from "../../../shared/services/store";
import {
  selectKeywords,
  fetchKeywords,
  selectError,
  selectSliceState,
} from "../store/KeywordListSlice";

import { clearCurrentKeyword } from "../store/KeywordDetailSlice";

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

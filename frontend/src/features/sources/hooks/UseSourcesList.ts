import { useEffect } from "react";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { clearCurrentSource, fetchSources, selectError, selectSliceState, selectSources } from "../store/SourceSlice";

export const useSourcesList = (gotoSourceAdd: ()=>void) => {
  const sources = useSelector(selectSources);
  const sliceState = useSelector(selectSliceState);
  const error = useSelector(selectError)
  const dispatch = useDispatch();
  
  const fetchRecords = () =>{
    dispatch(fetchSources());
  }

  useEffect(() => {
    fetchRecords();
  }, [dispatch]);

  const addNewSource = () => {
    dispatch(clearCurrentSource());
    gotoSourceAdd();
  };

  return {sources, sliceState, error, addNewSource, fetchRecords}
};

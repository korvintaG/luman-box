import { useSelector, useDispatch } from "../../../shared/services/store";
import {
    selectAuthors,
    fetchAuthors,
    selectSliceState,
    selectError,
  } from "../store/AuthorListSlice";

  import { clearCurrentAuthor } from "../store/AuthorDetailsSlice";


export const useAuthorList =(gotoAuthorAdd:()=>void)=>{
    const authors = useSelector(selectAuthors);
    const sliceState = useSelector(selectSliceState)
    const error= useSelector(selectError)
    const dispatch = useDispatch();

    const fetchRecords = ()=>{
      dispatch(fetchAuthors());
    }

    const addNewAuthor = () => {
        dispatch(clearCurrentAuthor());
        gotoAuthorAdd();
      };

    return {authors, sliceState, addNewAuthor, fetchRecords, error}
}
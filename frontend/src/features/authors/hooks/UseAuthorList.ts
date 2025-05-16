import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "../../../shared/services/store";
import {
    selectAuthors,
    fetchAuthors,
    selectIsDataLoading,
    clearCurrentAuthor,
    selectSliceState,
    selectError,
  } from "../store/AuthorSlice";


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

    useEffect(() => {
      fetchRecords()
      }, []);
 
    return {authors, sliceState, addNewAuthor, fetchRecords, error}
}
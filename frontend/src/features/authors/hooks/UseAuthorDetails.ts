import { useEffect, SyntheticEvent } from "react";
import { pick } from "lodash";
import { useForm } from "../../../shared/hooks/useForm";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { Author, AuthorInner } from "../AuthorTypes";
import { User } from "../../auth/user-types";
import {
  setAuthor,
  selectCurrentAuthor,
  delAuthor,
  selectError,
  approveAuthor,
  getAuthor,
  addAuthor,
  selectSliceState,
  rejectAuthor,
 } from "../store/AuthorSlice";
 import {
    getEditAccess,
  } from "../../../shared/utils/utils";
import { DetailsHookProps, IDetailsHookRes } from "../../../shared/common-types";
  

export const useAuthorDetails =({id, currentUser}: DetailsHookProps)
  : IDetailsHookRes<AuthorInner, Author> =>{
    const { values, handleChange, setValues, getFormDTO } = useForm <AuthorInner>({
        name: "",
      });
    
      const dispatch = useDispatch();
      const sliceState = useSelector(selectSliceState);
      const errorText = useSelector(selectError);
      const currentRecord = useSelector(selectCurrentAuthor);
      const editAccessStatus = getEditAccess(id, currentUser, currentRecord)
    
      function fetchRecord() {
        if (id) dispatch(getAuthor(Number(id)));
      }
    
      useEffect(() => fetchRecord(), []);
    
      useEffect(() => {
        if (currentRecord) 
          setValues({ ...pick(currentRecord, ["name"]) });
      }, [currentRecord, setValues]);
    
      const deleteRecordAction = (e: SyntheticEvent) => {
        e.preventDefault();
        dispatch(delAuthor(Number(id)));
      };
    
      const approveRecordAction = (e: SyntheticEvent) => {
        e.preventDefault();
        dispatch(approveAuthor(Number(id)));
      };
     
      const rejectRecordAction = (e: SyntheticEvent) => {
        e.preventDefault();
        dispatch(rejectAuthor(Number(id)));
      };
    
      const handleSubmitAction = (e: SyntheticEvent) => {
        //console.log('useAuthorDetails handleSubmit')
        e.preventDefault();
        if (id) {
          //console.log('useAuthorDetails handleSubmit id')
          const newo = { ...getFormDTO(), id: Number(id) };
          dispatch(setAuthor(newo));
        } 
        else {
          //console.log('useAuthorDetails handleSubmit not id',getFormDTO())
          dispatch(addAuthor({ ...getFormDTO() }));
        }
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
        }
      }
       
}
import {
    createAsyncThunk,
    createSlice,
    isAnyOf,
  } from "@reduxjs/toolkit";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import keywordAPI from "../api/keyword-api";
import { KeywordDetail, KeywordSummary } from "../types/keyword-types";
    
  type KeywordAddState = {
    //classKeyword?: KeywordDetail,
    keywordSummary?: KeywordSummary,
    status: RequestStatus,
    error: string,
    errorClass: string;
    newID: number | undefined;
  }

  export const initialState : KeywordAddState = {
    status: RequestStatus.Idle,
    error: "",
    errorClass:"",
    newID: undefined
  };
  
  // блок для добавления
  export const fetchKeywordSummary = createAsyncThunk("fetchKeywordSummary", keywordAPI.getEntitySummary);
  
  // DML 
  export const addKeyword = createAsyncThunk("addKeyword", keywordAPI.addEntity);
  
/**
 * Слайс для взаимосвязи идей
 */
const keywordAddSlice = createSlice({
    name: "keywordAdd",
    initialState,
    reducers: {
      setSliceStatus: (state, action) => {
        state.status = action.payload; //RequestStatus.Success;
      },
      clearKeywordSummary: (state) => {
        state.keywordSummary = undefined;
        state.newID = undefined;
        state.error = '';
        state.errorClass = '';
        state.status = RequestStatus.Idle;
      },
      setUpdateError : (state, error) =>{
        state.status=RequestStatus.FailedUpdate;
        state.error=error.payload 
      },
    },
    selectors: {
      selectKeywordSummary: (sliceState) => sliceState.keywordSummary,
      selectSliceState: (sliceState) => sliceState.status,
      selectError: (sliceState) => sliceState.error,
      selectFindError: (sliceState) => sliceState.errorClass,
      selectNewID: (sliceState) => sliceState.newID
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchKeywordSummary.pending, (state) => {
            state.status = RequestStatus.Finding;
            state.keywordSummary = undefined;
            state.errorClass = '';
          })
          .addCase(fetchKeywordSummary.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            state.keywordSummary = action.payload;
          })
          .addCase(addKeyword.fulfilled, (state, action) => {
            state.status = RequestStatus.Added;
            state.newID = action.payload.id;
          })
          .addCase(addKeyword.rejected, (state, action) => {
            state.status = RequestStatus.FailedAdd;
            state.error = action.error.message!;
          })
          .addMatcher(
            isAnyOf(addKeyword.pending, 
              fetchKeywordSummary.pending, 
              ),
            (state) => {
              state.status = RequestStatus.Loading;
              state.error = '';
              state.errorClass ='';
            },
          )
          .addMatcher(
            isAnyOf(fetchKeywordSummary.rejected, 
              ),
            (state, action) => {
              state.status = RequestStatus.Failed;
              state.error = action.error.message!;
            },
          )
    }
})
  
export const {
    selectSliceState,
    selectError,
    selectFindError,
    selectNewID,
    selectKeywordSummary
  } = keywordAddSlice.selectors;
export const {  setUpdateError, setSliceStatus, clearKeywordSummary } = keywordAddSlice.actions;
export default keywordAddSlice.reducer;
  
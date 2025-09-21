import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    isAnyOf,
  } from "@reduxjs/toolkit";
  import { IdeaForList  } from "../../idea/types/IdeaTypes";
  import interconnectionAPI from "../api/interconnection-api";
  import ideaAPI from '../../idea/api/idea-api'
    import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { InterconnectionAddForm, InterconnectionUpdateForm } from "../types/UI-types";
import { InterconnectionList } from "../types/query-types";
import { InterconnectionDetail, InterconnectionDetailAttachments } from "../types/entity-types";
    
  type InterconnectionEditState = {
    currentEdit?: InterconnectionDetail, // для редактирования взаимосвязи
    status: RequestStatus,
    error: string,
  }

  export const initialState : InterconnectionEditState = {
    status: RequestStatus.Idle,
    error: "",
  };
  
  export const fetchInterconnection  = createAsyncThunk("fetchInterconnection", interconnectionAPI.getEntity);

  // DML 
  export const setInterconnection = createAsyncThunk("setInterconnection", interconnectionAPI.setEntity);
  export const delInterconnection = createAsyncThunk("delInterconnection", interconnectionAPI.delEntity);
  export const approveInterconnection = createAsyncThunk(
    "approveInterconnection",
    interconnectionAPI.approveEntity);
  export const rejectInterconnection = createAsyncThunk(
    "rejectInterconnection",
    interconnectionAPI.rejectEntity);
  export const toModerateInterconnection = createAsyncThunk(
    "toModerateInterconnection",
    interconnectionAPI.toModerateEntity);  
  
/**
 * Слайс для взаимосвязи идей
 */
const interconnectionEditSlice = createSlice({
    name: "interconnectionEdit",
    initialState,
    reducers: {
      setSliceStatus: (state, action) => {
        state.status = action.payload; //RequestStatus.Success;
      },
      setUpdateError : (state, error) =>{
        state.status=RequestStatus.FailedUpdate;
        state.error=error.payload 
      },
    },
    selectors: {
      selectInterconnectionEdit: (sliceState) => sliceState.currentEdit,
      selectSliceState: (sliceState) => sliceState.status,
      selectError: (sliceState) => sliceState.error,
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchInterconnection.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            state.currentEdit = action.payload;
          })
          .addCase(setInterconnection.fulfilled, (state, _) => {
            state.status = RequestStatus.Updated;
          })
          .addCase(toModerateInterconnection.fulfilled, (state, _) => {
            state.status = RequestStatus.SendToModerating;
          })
          .addCase(approveInterconnection.fulfilled, (state, _) => {
            state.status = RequestStatus.Updated;
          })
          .addCase(delInterconnection.fulfilled, (state, _) => {
            state.status = RequestStatus.Deleted;
          })
          .addCase(delInterconnection.rejected, (state, action) => {
            state.status = RequestStatus.FailedDelete;
            state.error = action.error.message!;
          })            
          .addCase(setInterconnection.rejected, (state, action) => {
            state.status = RequestStatus.FailedUpdate;
            state.error = action.error.message!;
          })
          .addCase(toModerateInterconnection.rejected, (state, action) => {
            state.status = RequestStatus.FailedUpdate;
            state.error = action.error.message!;
          })
          .addCase(approveInterconnection.rejected, (state, action) => {
            state.status = RequestStatus.FailedUpdate;
            state.error = action.error.message!;
          })
          .addMatcher(
            isAnyOf(setInterconnection.pending, 
              delInterconnection.pending, 
              fetchInterconnection.pending, 
              approveInterconnection.pending,
              toModerateInterconnection.pending,
              ),
            (state) => {
              state.status = RequestStatus.Loading;
              state.error = '';
            },
          )
          .addMatcher(
            isAnyOf(fetchInterconnection.rejected, 
              ),
            (state, action) => {
              state.status = RequestStatus.Failed;
              state.error = action.error.message!;
            },
          )
    }
})
  
export const {
    selectInterconnectionEdit,
    selectSliceState,
    selectError,
  } = interconnectionEditSlice.selectors;
export const { setUpdateError, setSliceStatus } = interconnectionEditSlice.actions;
export default interconnectionEditSlice.reducer;
  
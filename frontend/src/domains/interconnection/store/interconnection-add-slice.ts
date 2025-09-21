import {
    createAsyncThunk,
    createSlice,
    isAnyOf,
  } from "@reduxjs/toolkit";
  import interconnectionAPI from "../api/interconnection-api";
  import ideaAPI from '../../idea/api/idea-api'
    import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { InterconnectionDetailAttachments } from "../types/entity-types";
    
  type InterconnectionAddState = {
    currentAdd?: InterconnectionDetailAttachments, // для добавления новой взаимосвязи
    status: RequestStatus,
    error: string,
    errorFind: string;
    newID: number | undefined;
  }

  export const initialState : InterconnectionAddState = {
    status: RequestStatus.Idle,
    error: "",
    errorFind:"",
    newID: undefined
  };
  
  // блок для добавления
  export const fetchCurrentIdea = createAsyncThunk("fetchCurrentIdea", ideaAPI.getIdeaForList);
  export const fetchIdeaToSet = createAsyncThunk("fetchIdeaToSet", ideaAPI.getIdeaForList);
  
  // DML 
  export const addInterconnection = createAsyncThunk("addInterconnection", interconnectionAPI.addEntity);
  
/**
 * Слайс для взаимосвязи идей
 */
const interconnectionAddSlice = createSlice({
    name: "interconnectionAdd",
    initialState,
    reducers: {
      clearCurrentInterconnection: (state) => {
        state.currentAdd = undefined;
      },
      setSliceStatus: (state, action) => {
        state.status = action.payload; //RequestStatus.Success;
      },
      setUpdateError : (state, error) =>{
        state.status=RequestStatus.FailedUpdate;
        state.error=error.payload 
      },
      resetFoundData: (state) => {
        if (state.currentAdd)
          state.currentAdd.idea_interconnect=null;
        state.status=RequestStatus.Idle;
        state.errorFind='';
      }
    },
    selectors: {
      selectInterconnectionAdd: (sliceState) => sliceState.currentAdd,
      selectSliceState: (sliceState) => sliceState.status,
      selectError: (sliceState) => sliceState.error,
      selectFindError: (sliceState) => sliceState.errorFind,
      selectNewID: (sliceState) => sliceState.newID
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchIdeaToSet.pending, (state) => {
            state.status = RequestStatus.Finding;
            if (state.currentAdd)
              state.currentAdd = {...state.currentAdd, idea_interconnect:null};
            else
              state.currentAdd = {idea_interconnect:null, idea_current: null};
            state.errorFind = '';
          })
          .addCase(fetchCurrentIdea.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            state.currentAdd={idea_current: action.payload, idea_interconnect: null};
          })
          .addCase(fetchIdeaToSet.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            if (state.currentAdd)
              state.currentAdd = {...state.currentAdd, idea_interconnect:action.payload};
            else
              state.currentAdd = {idea_interconnect:action.payload, idea_current: null};
          })
          .addCase(addInterconnection.fulfilled, (state, action) => {
            state.status = RequestStatus.Added;
            state.newID = action.payload.id;
          })
          .addCase(addInterconnection.rejected, (state, action) => {
            state.status = RequestStatus.FailedAdd;
            state.error = action.error.message!;
          })
          .addCase(fetchIdeaToSet.rejected, (state, action) => {
            state.status = RequestStatus.FailedFind;
            if (state.currentAdd)
              state.currentAdd.idea_interconnect=null;
            state.errorFind = action.error.message!;
          })
          .addMatcher(
            isAnyOf(addInterconnection.pending, 
              fetchCurrentIdea.pending, 
              ),
            (state) => {
              state.status = RequestStatus.Loading;
              state.error = '';
              state.errorFind ='';
            },
          )
          .addMatcher(
            isAnyOf(fetchCurrentIdea.rejected, 
              ),
            (state, action) => {
              state.status = RequestStatus.Failed;
              state.error = action.error.message!;
            },
          )
    }
})
  
export const {
    selectInterconnectionAdd,
    selectSliceState,
    selectError,
    selectFindError,
    selectNewID
  } = interconnectionAddSlice.selectors;
export const { clearCurrentInterconnection, resetFoundData, setUpdateError, setSliceStatus } = interconnectionAddSlice.actions;
export default interconnectionAddSlice.reducer;
  
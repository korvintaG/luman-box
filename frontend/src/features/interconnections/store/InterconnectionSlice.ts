import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
    isAnyOf,
  } from "@reduxjs/toolkit";
  import { IdeaForList  } from "../../ideas/IdeaTypes";
  import interconnectionAPI from "../api/interconnectionApi";
  import ideaAPI from '../../ideas/api/ideaAPI'
  import { IdeaInterconnections, InterconnectionAddData, InterconnectionEditData } from "../../../features/interconnections/InterconnectionTypes"
  import { RequestStatus } from "../../../shared/common-types";
    
  type InterconnectionState = {
    list?: IdeaInterconnections,  // для списка взаимосвязей
    currentEdit?: InterconnectionEditData, // для редактирования взаимосвязи
    currentAdd?: InterconnectionAddData, // для добавления новой взаимосвязи
    status: RequestStatus,
    error: string,
    errorFind: string;
  }

  export const initialState : InterconnectionState = {
    status: RequestStatus.Idle,
    error: "",
    errorFind:""
  };
  
  export const fetchInterconnections = createAsyncThunk("fetchInterconnections", interconnectionAPI.getIdeaInterconnections);
  export const fetchInterconnection  = createAsyncThunk("fetchInterconnection", interconnectionAPI.getInterconnection);

  // блок для добавления
  export const fetchCurrentIdea = createAsyncThunk("fetchCurrentIdea", ideaAPI.getIdeaForList);
  export const fetchIdeaToSet = createAsyncThunk("fetchIdeaToSet", ideaAPI.getIdeaForList);
  //export const fetchInterconnectionIdeaByID = createAsyncThunk("fetchInterconnectionIdeaByID", interconnectionAPI.getInterconnectionIdeaByID);

  // DML 
  export const addInterconnection = createAsyncThunk("addInterconnection", interconnectionAPI.addInterconnection);
  export const setInterconnection = createAsyncThunk("setInterconnection", interconnectionAPI.setInterconnection);
  export const delInterconnection = createAsyncThunk("delInterconnection", interconnectionAPI.delInterconnection);
  export const approveInterconnection = createAsyncThunk(
    "approveInterconnection",
    interconnectionAPI.approveInterconnection);
  
/**
 * Слайс для взаимосвязи идей
 */
const interconnectionsSlice = createSlice({
    name: "interconnections",
    initialState,
    reducers: {
      clearCurrentInterconnection: (state) => {
        state.currentAdd = undefined;
      },
      resetSliceState: (state) => {
        state.status=RequestStatus.Idle;
      },
      setUpdateError : (state, error) =>{
        state.status=RequestStatus.FailedUpdate;
        state.error=error.payload 
      },
      resetFoundData: (state) => {
        if (state.currentAdd)
          state.currentAdd.ideaInterconnect=null;
        state.status=RequestStatus.Idle;
        state.errorFind='';
      }
    },
    selectors: {
      selectInterconnections: (sliceState) => sliceState.list,
      selectInterconnectionEdit: (sliceState) => sliceState.currentEdit,
      selectInterconnectionAdd: (sliceState) => sliceState.currentAdd,
      selectSliceState: (sliceState) => sliceState.status,
      selectError: (sliceState) => sliceState.error,
      selectFindError: (sliceState) => sliceState.errorFind
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchIdeaToSet.pending, (state) => {
            state.status = RequestStatus.Finding;
            if (state.currentAdd)
              state.currentAdd = {...state.currentAdd, ideaInterconnect:null};
            else
              state.currentAdd = {ideaInterconnect:null, ideaCurrent: null};
            state.errorFind = '';
          })
          .addCase(fetchInterconnections.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            state.list = action.payload;
          })
          .addCase(fetchCurrentIdea.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            state.currentAdd={ideaCurrent: action.payload, ideaInterconnect: null};
          })
          .addCase(fetchIdeaToSet.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            if (state.currentAdd)
              state.currentAdd = {...state.currentAdd, ideaInterconnect:action.payload};
            else
              state.currentAdd = {ideaInterconnect:action.payload, ideaCurrent: null};
          })
          .addCase(fetchInterconnection.fulfilled, (state, action) => {
            state.status = RequestStatus.Success;
            state.currentEdit = action.payload;
          })
          .addCase(setInterconnection.fulfilled, (state, _) => {
            state.status = RequestStatus.Updated;
          })
          .addCase(approveInterconnection.fulfilled, (state, _) => {
            state.status = RequestStatus.Updated;
          })
          .addCase(addInterconnection.fulfilled, (state, _) => {
            state.status = RequestStatus.Added;
          })
          .addCase(delInterconnection.fulfilled, (state, _) => {
            state.status = RequestStatus.Deleted;
          })
          .addCase(delInterconnection.rejected, (state, action) => {
            state.status = RequestStatus.FailedDelete;
            state.error = action.error.message!;
          })            
          .addCase(addInterconnection.rejected, (state, action) => {
            state.status = RequestStatus.FailedAdd;
            state.error = action.error.message!;
          })
          .addCase(setInterconnection.rejected, (state, action) => {
            state.status = RequestStatus.FailedUpdate;
            state.error = action.error.message!;
          })
          .addCase(approveInterconnection.rejected, (state, action) => {
            state.status = RequestStatus.FailedUpdate;
            state.error = action.error.message!;
          })
          .addCase(fetchIdeaToSet.rejected, (state, action) => {
            state.status = RequestStatus.FailedFind;
            if (state.currentAdd)
              state.currentAdd.ideaInterconnect=null;
            state.errorFind = action.error.message!;
          })
          .addMatcher(
            isAnyOf(addInterconnection.pending, 
              setInterconnection.pending, 
              fetchInterconnections.pending, 
              delInterconnection.pending, 
              fetchCurrentIdea.pending, 
              fetchInterconnection.pending, 
              approveInterconnection.pending
              ),
            (state) => {
              state.status = RequestStatus.Loading;
              state.error = '';
              state.errorFind ='';
            },
          )
          .addMatcher(
            isAnyOf(fetchInterconnections.rejected, 
              fetchCurrentIdea.rejected, 
              fetchInterconnection.rejected, 
              //fetchInterconnectionIdeaByID.rejected
              ),
            (state, action) => {
              state.status = RequestStatus.Failed;
              state.error = action.error.message!;
            },
          )
    }
})
  
export const {
    selectInterconnections,
    selectInterconnectionAdd,
    selectInterconnectionEdit,
    selectSliceState,
    selectError,
    selectFindError
  } = interconnectionsSlice.selectors;
export const { clearCurrentInterconnection, resetFoundData, resetSliceState, setUpdateError } = interconnectionsSlice.actions;
export default interconnectionsSlice.reducer;
  
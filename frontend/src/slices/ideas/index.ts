import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { Idea, RequestStatus } from '../../utils/type'
import { ListToWork,  ErrorAction } from '../utils'
import LumanAPI from '../../utils/luman-api'
import {isUnauthorizedError} from '../../utils/utils'

export const initialState: ListToWork<Idea> = {
  list: [],
  current: null,
  status: RequestStatus.Idle,
  error: ''
}; 

export const fetchIdeas = createAsyncThunk('fetchIdeas', LumanAPI.getIdeas);
export const fetchIdeasBySrcKw = createAsyncThunk('fetchIdeasBySrcKw', LumanAPI.getIdeasBySrcKw);
export const getIdea = createAsyncThunk('getIdea', LumanAPI.getIdea);
export const getIdeaBySrcKw = createAsyncThunk('getIdeaBySrcKw', LumanAPI.getIdeaBySourceKeyword);
export const setIdea = createAsyncThunk('setIdea', LumanAPI.setIdea);
export const addIdea = createAsyncThunk('addIdea', LumanAPI.addIdea);
export const approveIdea = createAsyncThunk('approveIdea', LumanAPI.approveIdea);
export const rejectIdea = createAsyncThunk('approveIdea', LumanAPI.rejectIdea);
export const delIdea = createAsyncThunk('delIdea', LumanAPI.delIdea);


export function isPendingIdeaAction(action: PayloadAction) {
  return action.type.endsWith('pending') && action.type.includes('Idea');
}  

export function isRejectedIdeaAction(action: PayloadAction) {
  return action.type.endsWith('rejected')  && action.type.includes('Idea');
} 


/**
 * Слайс для идей
 */
const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    clearCurrentIdea: (state) => {
      state.current = null;
    },
    setStateSuccess: (state) => {
      state.status=RequestStatus.Success;
    },
    resetStatus: (state) => {
      state.status=RequestStatus.Idle;
    },

  },
  selectors: {
    selectIdeas: (sliceState) => sliceState.list,
    selectCurrentIdea: (sliceState) => sliceState.current,
    selectIsDataLoading: (sliceState) => sliceState.status===RequestStatus.Loading,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(addIdea.fulfilled, (state, _) => {
        state.status=RequestStatus.Added;
      })
      .addCase(delIdea.fulfilled, (state, _) => {
        state.status=RequestStatus.Deleted;
      })
      .addCase(addIdea.rejected, (state, _) => {
        state.status=RequestStatus.FailedAdd;
      })
      .addCase(delIdea.rejected, (state, _) => {
        state.status=RequestStatus.FailedDelete;
      })
      .addMatcher(isAnyOf(setIdea.fulfilled, approveIdea.fulfilled, rejectIdea.fulfilled), (state) => {
        state.status=RequestStatus.Updated;
      })
      .addMatcher(isAnyOf(setIdea.rejected, approveIdea.rejected, rejectIdea.rejected), (state) => {
        state.status=RequestStatus.FailedUpdate;
      })
      .addMatcher(isAnyOf(fetchIdeas.pending,fetchIdeasBySrcKw.pending), (state) => {
        state.list = [];
      })
      .addMatcher(isAnyOf(fetchIdeas.fulfilled,fetchIdeasBySrcKw.fulfilled), (state, action) => {
        state.list = action.payload;
      })
      .addMatcher(isAnyOf(getIdea.pending, getIdeaBySrcKw.pending), (state) => {
        state.current = null;
      })
      .addMatcher(isAnyOf(getIdea.fulfilled, getIdeaBySrcKw.fulfilled), (state, action) => {
        state.current = action.payload;;
      })
      .addMatcher(isAnyOf(getIdea.fulfilled, getIdeaBySrcKw.fulfilled, 
        fetchIdeas.fulfilled, fetchIdeasBySrcKw.fulfilled), (state) => {
        state.status = RequestStatus.Success;
      })
      .addMatcher(isPendingIdeaAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedIdeaAction, (state, action: ErrorAction) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status=RequestStatus.FailedUnAuth
      });
  }
});

export const { selectError, selectIdeas, selectCurrentIdea, selectSliceState, selectIsDataLoading } = ideasSlice.selectors;
export const { clearCurrentIdea, setStateSuccess, resetStatus } = ideasSlice.actions;
export default ideasSlice.reducer;

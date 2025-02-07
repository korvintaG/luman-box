import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { Idea, RequestStatus } from '../../utils/type'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'
import LumanAPI from '../../utils/luman-api'
import {isUnauthorizedError} from '../../utils/utils'

export const initialState: ListToWork<Idea> = {
  list: [],
  current: null,
  current_id_only: null,
  status: RequestStatus.Idle,
  error: ''
}; 

export const fetchIdeas = createAsyncThunk('fetchIdeas', LumanAPI.getIdeas);
export const fetchIdeasBySrcKw = createAsyncThunk('fetchIdeasBySrcKw', LumanAPI.getIdeasBySrcKw);
export const getIdea = createAsyncThunk('getIdea', LumanAPI.getIdea);
export const findIdeaIDBySrcKw = createAsyncThunk('findIdeaIDBySrcKw', LumanAPI.findIdeaIDBySourceKeyword);
export const setIdea = createAsyncThunk('setIdea', LumanAPI.setIdea);
export const addIdea = createAsyncThunk('addIdea', LumanAPI.addIdea);
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
    selectCurrentIdeaId: (sliceState) => sliceState.current_id_only,
    selectIsDataLoading: (sliceState) => sliceState.status==RequestStatus.Loading,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIdeas.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchIdeasBySrcKw.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getIdea.pending, (state) => {
        state.current = null;
        state.current_id_only = null;
      })
      .addCase(getIdea.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(findIdeaIDBySrcKw.pending, (state) => {
        state.current_id_only = null;
      })
      .addCase(findIdeaIDBySrcKw.fulfilled, (state, action) => {
        state.current_id_only = action.payload.id;
      })
      .addCase(addIdea.fulfilled, (state, _) => {
        state.status=RequestStatus.Added;
      })
      .addCase(setIdea.fulfilled, (state, _) => {
        state.status=RequestStatus.Updated;
      })
      .addCase(delIdea.fulfilled, (state, _) => {
        state.status=RequestStatus.Deleted;
      })
      .addCase(addIdea.rejected, (state, _) => {
        state.status=RequestStatus.FailedAdd;
      })
      .addCase(setIdea.rejected, (state, _) => {
        state.status=RequestStatus.FailedUpdate;
      })
      .addCase(delIdea.rejected, (state, _) => {
        state.status=RequestStatus.FailedDelete;
      })
      .addMatcher(isAnyOf(getIdea.fulfilled,fetchIdeas.fulfilled, fetchIdeasBySrcKw.fulfilled), (state) => {
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

export const { selectError, selectIdeas, selectCurrentIdea, selectCurrentIdeaId, selectSliceState, selectIsDataLoading } = ideasSlice.selectors;
export const { clearCurrentIdea, setStateSuccess, resetStatus } = ideasSlice.actions;
export default ideasSlice.reducer;

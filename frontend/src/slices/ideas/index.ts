import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { Idea, RequestStatus } from '../../utils/type'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'
import { getIdeasAPI, setIdeaAPI, getIdeaAPI, addIdeaAPI, delIdeaAPI } from '../../utils/luman-api'

export const initialState: ListToWork<Idea> = {
  list: [],
  current: null,
  status: RequestStatus.Idle,
  error: ''
}; 

export const fetchIdeas = createAsyncThunk('fetchIdeas', getIdeasAPI);
export const setIdea = createAsyncThunk('setIdea', setIdeaAPI);
export const getIdea = createAsyncThunk('getIdea', getIdeaAPI);
export const addIdea = createAsyncThunk('addIdea', addIdeaAPI);
export const delIdea = createAsyncThunk('delIdea', delIdeaAPI);


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
  },
  selectors: {
    selectIdeas: (sliceState) => sliceState.list,
    selectCurrentIdea: (sliceState) => sliceState.current,
    selectIsDataLoading: (sliceState) => sliceState.status==RequestStatus.Loading,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIdeas.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getIdea.pending, (state) => {
        state.current = null;
      })
      .addCase(getIdea.fulfilled, (state, action) => {
        state.current = action.payload;
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
      .addMatcher(isAnyOf(getIdea.fulfilled,fetchIdeas.fulfilled), (state) => {
        state.status = RequestStatus.Success;
      })
      .addMatcher(isPendingIdeaAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedIdeaAction, (state, action: ErrorAction) => {
        state.error = action.error.message!;
      });
  }
});

export const { selectError, selectIdeas, selectCurrentIdea, selectSliceState, selectIsDataLoading } = ideasSlice.selectors;
export const { clearCurrentIdea, setStateSuccess } = ideasSlice.actions;
export default ideasSlice.reducer;

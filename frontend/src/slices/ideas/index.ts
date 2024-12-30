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
        state.status=RequestStatus.Success;
      })
      .addCase(getIdea.fulfilled, (state, action) => {
        state.current = action.payload;
        state.status=RequestStatus.Success;
      })
      .addMatcher(isAnyOf(addIdea.fulfilled,delIdea.fulfilled,setIdea.fulfilled), (state) => {
        state.status = RequestStatus.Updated;
      })
      .addMatcher(isPendingIdeaAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedIdeaAction, (state, action: ErrorAction) => {
        state.status=RequestStatus.Failed;
        state.error = action.error.message!;
      });
  }
});

export const { selectError, selectIdeas, selectCurrentIdea, selectSliceState, selectIsDataLoading } = ideasSlice.selectors;
export const { clearCurrentIdea } = ideasSlice.actions;
export default ideasSlice.reducer;

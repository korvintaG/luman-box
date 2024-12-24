import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IdeaExtension, RequestStatus } from '../../utils/type'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'
import { getIdeasAPI, setIdeaAPI, getIdeaAPI, addIdeaAPI, delIdeaAPI } from '../../utils/luman-api'

export const initialState: ListToWork<IdeaExtension> = {
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
      .addCase(setIdea.fulfilled, (state, _) => {
        state.status = RequestStatus.Updated;
      })
      .addCase(addIdea.fulfilled, (state, _) => {
        state.status = RequestStatus.Updated;
      })
      .addCase(delIdea.fulfilled, (state, _) => {
        state.status = RequestStatus.Updated;
      })
      .addMatcher(isPendingAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedAction, (state, action: ErrorAction) => {
        state.status=RequestStatus.Failed;
        state.error = action.error.message!;
      });
  }
});

export const { selectError, selectIdeas, selectCurrentIdea, selectSliceState, selectIsDataLoading } = ideasSlice.selectors;
export const { clearCurrentIdea } = ideasSlice.actions;
export default ideasSlice.reducer;

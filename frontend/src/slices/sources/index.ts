import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { Source, RequestStatus } from '../../utils/type'
import { getSourcesAPI, getSourceAPI, setSourceAPI, addSourceAPI, delSourceAPI } from '../../utils/luman-api'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'

export const initialState: ListToWork<Source> = {
  list: [],
  current: null,
  status: RequestStatus.Idle,
  error: ''
};

export const fetchSources = createAsyncThunk('fetchSources', getSourcesAPI);
export const getSource = createAsyncThunk('getSource', getSourceAPI);
export const setSource = createAsyncThunk('setSource', setSourceAPI);
export const addSource = createAsyncThunk('addSource', addSourceAPI);
export const delSource = createAsyncThunk('delSource', delSourceAPI);

export function isPendingSourceAction(action: PayloadAction) {
  return action.type.endsWith('pending') && action.type.includes('Source');
}  

export function isRejectedSourceAction(action: PayloadAction) {
  return action.type.endsWith('rejected')  && action.type.includes('Source');
} 


/**
 * Слайс для источников
 */
const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    clearCurrentSource: (state) => {
      state.current = null;
    },
  },
  selectors: {
    selectSources: (sliceState) => sliceState.list,
    selectCurrentSource: (sliceState) => sliceState.current,
    selectIsDataLoading: (sliceState) => sliceState.status==RequestStatus.Loading,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.status=RequestStatus.Success;       
        state.list = action.payload;
      })
      .addCase(getSource.pending, (state) => {
        state.current = null;
      })
      .addCase(getSource.fulfilled, (state, action) => {
        state.status=RequestStatus.Success;       
        state.current = action.payload;
      })
      .addMatcher(isAnyOf(addSource.fulfilled,setSource.fulfilled,delSource.fulfilled), (state) => {
        state.status=RequestStatus.Updated
      })
      .addMatcher(isPendingSourceAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedSourceAction, (state, action: ErrorAction) => {
        state.status=RequestStatus.Failed;
        state.error = action.error.message!;
      });
  }
});

export const { selectSources, selectCurrentSource, selectSliceState, selectIsDataLoading, selectError } = sourcesSlice.selectors;
export const { clearCurrentSource } = sourcesSlice.actions;
export default sourcesSlice.reducer;

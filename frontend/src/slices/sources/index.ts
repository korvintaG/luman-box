import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SourceExtension, RequestStatus } from '../../utils/type'
import { getSourcesAPI, getSourceAPI, setSourceAPI, addSourceAPI, delSourceAPI } from '../../utils/luman-api'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'

export const initialState: ListToWork<SourceExtension> = {
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
      .addCase(setSource.fulfilled, (state, _) => {
        state.status=RequestStatus.Updated
      })
      .addCase(addSource.fulfilled, (state, _) => {
        state.status=RequestStatus.Updated
      })
      .addCase(delSource.fulfilled, (state, _) => {
        state.status=RequestStatus.Updated
      })
      .addMatcher(isPendingAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedAction, (state, action: ErrorAction) => {
        state.status=RequestStatus.Failed;
        state.error = action.error.message!;
      })
      /*.addMatcher(isFullFilledAction, (state, _) => {
        console.log('sourcesSlice addMatcher(isFullFilledAction',state.status);
        if (state.status===RequestStatus.Loading)  {
          console.log('sourcesSlice addMatcher(isFullFilledAction set',RequestStatus.Success);
          state.status=RequestStatus.Success;       
        } 
      })*/;
  }
});

export const { selectSources, selectCurrentSource, selectSliceState, selectIsDataLoading, selectError } = sourcesSlice.selectors;
export const { clearCurrentSource } = sourcesSlice.actions;
export default sourcesSlice.reducer;

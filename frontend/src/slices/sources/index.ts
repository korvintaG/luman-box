import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { Source, RequestStatus } from '../../utils/type'
import LumanAPI from '../../utils/luman-api'
import { ListToWork, ErrorAction } from '../utils'
import {isUnauthorizedError} from '../../utils/utils'

export const initialState: ListToWork<Source> = {
  list: [],
  current: null,
  status: RequestStatus.Idle,
  error: ''
};

export const fetchSources = createAsyncThunk('fetchSources', LumanAPI.getSources);
export const getSource = createAsyncThunk('getSource', LumanAPI.getSource);
export const setSource = createAsyncThunk('setSource', LumanAPI.setSource);
export const addSource = createAsyncThunk('addSource', LumanAPI.addSource);
export const approveSource = createAsyncThunk('approveSource', LumanAPI.approveSource);
export const rejectSource = createAsyncThunk('approveSource', LumanAPI.rejectSource);
export const delSource = createAsyncThunk('delSource', LumanAPI.delSource);

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
    setStateSuccess: (state) => {
      state.status=RequestStatus.Success;
    },
  },
  selectors: {
    selectSources: (sliceState) => sliceState.list,
    selectCurrentSource: (sliceState) => sliceState.current,
    selectIsDataLoading: (sliceState) => sliceState.status===RequestStatus.Loading,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSources.pending, (state) => {
        state.list = [];
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getSource.pending, (state) => {
        state.current = null;
      })
      .addCase(getSource.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(addSource.fulfilled, (state, _) => {
        state.status=RequestStatus.Added;
      })
      .addCase(delSource.fulfilled, (state, _) => {
        state.status=RequestStatus.Deleted;
      })
      .addCase(addSource.rejected, (state, _) => {
        state.status=RequestStatus.FailedAdd;
      })
      .addCase(delSource.rejected, (state, _) => {
        state.status=RequestStatus.FailedDelete;
      })
      .addMatcher(isAnyOf(setSource.fulfilled,approveSource.fulfilled,rejectSource.fulfilled), (state) => {
        state.status=RequestStatus.Updated;
      })
      .addMatcher(isAnyOf(setSource.rejected,approveSource.rejected,rejectSource.rejected), (state) => {
        state.status=RequestStatus.FailedUpdate;
      })
      .addMatcher(isAnyOf(getSource.fulfilled,fetchSources.fulfilled), (state) => {
        state.status=RequestStatus.Success
      })
      .addMatcher(isPendingSourceAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedSourceAction, (state, action: ErrorAction) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status=RequestStatus.FailedUnAuth
      });
  }
});

export const { selectSources, selectCurrentSource, selectSliceState, selectIsDataLoading, selectError } = sourcesSlice.selectors;
export const { clearCurrentSource, setStateSuccess } = sourcesSlice.actions;
export default sourcesSlice.reducer;

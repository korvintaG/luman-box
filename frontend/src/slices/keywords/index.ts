import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { Keyword, RequestStatus } from '../../utils/type'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'
import { getKeywordsAPI, setKeywordAPI, getKeywordAPI, addKeywordAPI, delKeywordAPI } from '../../utils/luman-api'

export const initialState: ListToWork<Keyword> = {
  list: [],
  current: null,
  status: RequestStatus.Idle,
  error: ''
};

export const fetchKeywords = createAsyncThunk('fetchKeywords', getKeywordsAPI);
export const setKeyword = createAsyncThunk('setKeyword', setKeywordAPI);
export const getKeyword = createAsyncThunk('getKeyword', getKeywordAPI);
export const addKeyword = createAsyncThunk('addKeyword', addKeywordAPI);
export const delKeyword = createAsyncThunk('delKeyword', delKeywordAPI);

export function isPendingKeywordAction(action: PayloadAction) {
  return action.type.endsWith('pending') && action.type.includes('Keyword');
}  

export function isRejectedKeywordAction(action: PayloadAction) {
  return action.type.endsWith('rejected')  && action.type.includes('Keyword');
} 


/**
 * Слайс для ключевых слов
 */
const keywordsSlice = createSlice({
  name: 'keywords',
  initialState,
  reducers: {
    clearCurrentKeyword: (state) => {
      state.current = null;
    },
    setStateSuccess: (state) => {
      state.status=RequestStatus.Success;
    },
  },
  selectors: {
    selectKeywords: (sliceState) => sliceState.list,
    selectCurrentKeyword: (sliceState) => sliceState.current,
    selectIsDataLoading: (sliceState) => sliceState.status==RequestStatus.Loading,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKeywords.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getKeyword.pending, (state) => {
        state.current = null;
      })
      .addCase(getKeyword.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(addKeyword.fulfilled, (state, _) => {
        state.status=RequestStatus.Added;
      })
      .addCase(setKeyword.fulfilled, (state, _) => {
        state.status=RequestStatus.Updated;
      })
      .addCase(delKeyword.fulfilled, (state, _) => {
        state.status=RequestStatus.Deleted;
      })
      .addCase(addKeyword.rejected, (state, _) => {
        state.status=RequestStatus.FailedAdd;
      })
      .addCase(setKeyword.rejected, (state, _) => {
        state.status=RequestStatus.FailedUpdate;
      })
      .addCase(delKeyword.rejected, (state, _) => {
        state.status=RequestStatus.FailedDelete;
      })
      .addMatcher(isAnyOf(getKeyword.fulfilled,fetchKeywords.fulfilled), (state, _) => {
        state.status=RequestStatus.Success;
      })
      .addMatcher(isPendingKeywordAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedKeywordAction, (state, action: ErrorAction) => {
        state.error = action.error.message!;
      });
  }
});

export const { selectError, selectKeywords, selectCurrentKeyword, selectSliceState, selectIsDataLoading } = keywordsSlice.selectors;
export const { clearCurrentKeyword, setStateSuccess } = keywordsSlice.actions;
export default keywordsSlice.reducer;

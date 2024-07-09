import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Keyword } from '../../utils/type'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'
import { getKeywordsAPI, setKeywordAPI, getKeywordAPI, addKeywordAPI, delKeywordAPI } from '../../utils/emu/luman-emu-api'

export const initialState: ListToWork<Keyword> = {
  list: [],
  current: null,
  isLoading: false,
  error: ''
};

export const fetchKeywords = createAsyncThunk('fetchKeywords', getKeywordsAPI);
export const setKeyword = createAsyncThunk('setKeyword', setKeywordAPI);
export const getKeyword = createAsyncThunk('getKeyword', getKeywordAPI);
export const addKeyword = createAsyncThunk('addKeyword', addKeywordAPI);
export const delKeyword = createAsyncThunk('delKeyword', delKeywordAPI);

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
  },
  selectors: {
    selectKeywords: (sliceState) => sliceState.list,
    selectCurrentKeyword: (sliceState) => sliceState.current,
    selectIsDataLoading: (sliceState) => sliceState.isLoading,
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
      .addMatcher(isPendingAction, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addMatcher(isRejectedAction, (state, action: ErrorAction) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })
      .addMatcher(isFullFilledAction, (state, _) => {
        state.isLoading = false;
      });
  }
});

export const { selectError, selectKeywords, selectCurrentKeyword, selectIsDataLoading } = keywordsSlice.selectors;
export const { clearCurrentKeyword } = keywordsSlice.actions;
export default keywordsSlice.reducer;

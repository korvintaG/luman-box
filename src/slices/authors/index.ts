import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Author } from '../../utils/type'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'
import { getAuthorsAPI, setAuthorAPI, getAuthorAPI, addAuthorAPI, delAuthorAPI } from '../../utils/emu/luman-emu-api'

export const initialState: ListToWork<Author> = {
  list: [],
  current: null,
  isLoading: false,
  error: ''
};

export const fetchAuthors = createAsyncThunk('fetchAuthors', getAuthorsAPI);
export const setAuthor = createAsyncThunk('setAuthor', setAuthorAPI);
export const getAuthor = createAsyncThunk('getAuthor', getAuthorAPI);
export const addAuthor = createAsyncThunk('addAuthor', addAuthorAPI);
export const delAuthor = createAsyncThunk('delAuthor', delAuthorAPI);

/**
 * Слайс для авторов
 */
const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    clearCurrentAuthor: (state) => {
      state.current = null;
    },
  },
  selectors: {
    selectAuthors: (sliceState) => sliceState.list, 
    selectCurrentAuthor: (sliceState) => sliceState.current,  
    selectIsDataLoading: (sliceState) => sliceState.isLoading,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getAuthor.pending, (state) => {
        state.current = null;
      })
      .addCase(getAuthor.fulfilled, (state, action) => {
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

export const { selectError, selectAuthors, selectCurrentAuthor, selectIsDataLoading } = authorsSlice.selectors;
export const { clearCurrentAuthor } = authorsSlice.actions;
export default authorsSlice.reducer;

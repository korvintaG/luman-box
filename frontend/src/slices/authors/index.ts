import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Author, RequestStatus } from '../../utils/type'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'
import { getAuthorsAPI, setAuthorAPI, getAuthorAPI, addAuthorAPI, delAuthorAPI } from '../../utils/luman-api'

export const initialState: ListToWork<Author> = {
  list: [],
  current: null,
  status: RequestStatus.Idle,
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
    selectIsDataLoading: (sliceState) => sliceState.status==RequestStatus.Loading,
    selectSliceState: (sliceState) => sliceState.status,
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
      .addCase(setAuthor.fulfilled, (state, _) => {
        state.status=RequestStatus.Updated;
      })
      .addCase(addAuthor.fulfilled, (state, _) => {
        state.status=RequestStatus.Updated;
      })
      .addCase(delAuthor.fulfilled, (state, _) => {
        state.status=RequestStatus.Updated;
      })
      .addMatcher(isPendingAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedAction, (state, action: ErrorAction) => {
        state.status=RequestStatus.Failed;
        state.error = action.error.message!;
      })
      .addMatcher(isFullFilledAction, (state, _) => {
        if (state.status===RequestStatus.Loading)
          state.status=RequestStatus.Success;
      });
  }
});

export const { selectError, selectAuthors, selectCurrentAuthor, selectSliceState, selectIsDataLoading } = authorsSlice.selectors;
export const { clearCurrentAuthor } = authorsSlice.actions;
export default authorsSlice.reducer;

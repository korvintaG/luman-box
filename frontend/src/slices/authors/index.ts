import { createAsyncThunk, createSlice, isAnyOf , PayloadAction } from '@reduxjs/toolkit';
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

export function isPendingAuthorAction(action: PayloadAction) {
  return action.type.endsWith('pending') && action.type.includes('Author');
}  

export function isRejectedAuthorAction(action: PayloadAction) {
  return action.type.endsWith('rejected')  && action.type.includes('Author');
} 


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
    setStateSuccess: (state) => {
      state.status=RequestStatus.Success;
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
      .addCase(addAuthor.fulfilled, (state, _) => {
        state.status=RequestStatus.Added;
      })
      .addCase(setAuthor.fulfilled, (state, _) => {
        state.status=RequestStatus.Updated;
      })
      .addCase(delAuthor.fulfilled, (state, _) => {
        state.status=RequestStatus.Deleted;
      })
      .addCase(addAuthor.rejected, (state, _) => {
        state.status=RequestStatus.FailedAdd;
      })
      .addCase(setAuthor.rejected, (state, _) => {
        state.status=RequestStatus.FailedUpdate;
      })
      .addCase(delAuthor.rejected, (state, _) => {
        state.status=RequestStatus.FailedDelete;
      })
      .addMatcher(isAnyOf(getAuthor.fulfilled,fetchAuthors.fulfilled), (state, _) => {
        state.status=RequestStatus.Success;
      })
      .addMatcher(isPendingAuthorAction, (state) => {
        state.status=RequestStatus.Loading;
        state.error = '';
      })
      .addMatcher(isRejectedAuthorAction, (state, action: ErrorAction) => {
        state.error = action.error.message!;
      });
  }
});

export const { selectError, selectAuthors, selectCurrentAuthor, selectSliceState, selectIsDataLoading } = authorsSlice.selectors;
export const { clearCurrentAuthor, setStateSuccess } = authorsSlice.actions;
export default authorsSlice.reducer;

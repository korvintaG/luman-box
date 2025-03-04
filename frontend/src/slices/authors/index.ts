import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Author, RequestStatus } from "../../utils/type";
import { ListToWork, ErrorAction } from "../utils";
import LumanAPI from "../../utils/luman-api";
import { isUnauthorizedError } from "../../utils/utils";

export const initialState: ListToWork<Author> = {
  list: [],
  current: null,
  status: RequestStatus.Idle,
  error: "",
};

export const fetchAuthors = createAsyncThunk(
  "fetchAuthors",
  LumanAPI.getAuthors,
);
export const setAuthor = createAsyncThunk("setAuthor", LumanAPI.setAuthor);
export const approveAuthor = createAsyncThunk(
  "approveAuthor",
  LumanAPI.approveAuthor,
);
export const rejectAuthor = createAsyncThunk(
  "rejectAuthor",
  LumanAPI.rejectAuthor,
);
export const getAuthor = createAsyncThunk("getAuthor", LumanAPI.getAuthor);
export const addAuthor = createAsyncThunk("addAuthor", LumanAPI.addAuthor);
export const delAuthor = createAsyncThunk("delAuthor", LumanAPI.delAuthor);

export function isPendingAuthorAction(action: PayloadAction) {
  return action.type.endsWith("pending") && action.type.includes("Author");
}

export function isRejectedAuthorAction(action: PayloadAction) {
  return action.type.endsWith("rejected") && action.type.includes("Author");
}

/**
 * Слайс для авторов
 */
const authorsSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {
    clearCurrentAuthor: (state) => {
      state.current = null;
    },
    setStateSuccess: (state) => {
      state.status = RequestStatus.Success;
    },
  },
  selectors: {
    selectAuthors: (sliceState) => sliceState.list,
    selectCurrentAuthor: (sliceState) => sliceState.current,
    selectIsDataLoading: (sliceState) =>
      sliceState.status === RequestStatus.Loading,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.list = [];
      })
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
        state.status = RequestStatus.Added;
      })
      .addCase(delAuthor.fulfilled, (state, _) => {
        state.status = RequestStatus.Deleted;
      })
      .addCase(addAuthor.rejected, (state, _) => {
        state.status = RequestStatus.FailedAdd;
      })
      .addCase(delAuthor.rejected, (state, _) => {
        state.status = RequestStatus.FailedDelete;
      })
      .addMatcher(
        isAnyOf(
          setAuthor.rejected,
          approveAuthor.rejected,
          rejectAuthor.rejected,
        ),
        (state, _) => {
          state.status = RequestStatus.FailedUpdate;
        },
      )
      .addMatcher(
        isAnyOf(
          approveAuthor.fulfilled,
          rejectAuthor.fulfilled,
          setAuthor.fulfilled,
        ),
        (state, _) => {
          state.status = RequestStatus.Updated;
        },
      )
      .addMatcher(
        isAnyOf(getAuthor.fulfilled, fetchAuthors.fulfilled),
        (state, _) => {
          state.status = RequestStatus.Success;
        },
      )
      .addMatcher(isPendingAuthorAction, (state) => {
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addMatcher(isRejectedAuthorAction, (state, action: ErrorAction) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectAuthors,
  selectCurrentAuthor,
  selectSliceState,
  selectIsDataLoading,
} = authorsSlice.selectors;
export const { clearCurrentAuthor, setStateSuccess } = authorsSlice.actions;
export default authorsSlice.reducer;

import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isAnyOf,
} from "@reduxjs/toolkit";
import { ListToWork, ErrorAction } from "../../../shared/utils/ForSliceUtils";
import keywordAPI from "../api/keywordAPI";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { Keyword } from "../KeywordTypes";
import { RequestStatus } from "../../../shared/common-types";

export const initialState: ListToWork<Keyword> = {
  list: [],
  current: null,
  status: RequestStatus.Idle,
  error: "",
};

export const fetchKeywords = createAsyncThunk(
  "fetchKeywords",
  keywordAPI.getKeywords,
);
export const setKeyword = createAsyncThunk("setKeyword", keywordAPI.setKeyword);
export const getKeyword = createAsyncThunk("getKeyword", keywordAPI.getKeyword);
export const addKeyword = createAsyncThunk("addKeyword", keywordAPI.addKeyword);
export const approveKeyword = createAsyncThunk(
  "approveKeyword",
  keywordAPI.approveKeyword,
);
export const rejectKeyword = createAsyncThunk(
  "approveKeyword",
  keywordAPI.rejectKeyword,
);
export const delKeyword = createAsyncThunk("delKeyword", keywordAPI.delKeyword);

/*export function isPendingKeywordAction(action: PayloadAction) {
  return action.type.endsWith("pending") && action.type.includes("Keyword");
}

export function isRejectedKeywordAction(action: PayloadAction) {
  return action.type.endsWith("rejected") && action.type.includes("Keyword");
}*/

/**
 * Слайс для ключевых слов
 */
const keywordsSlice = createSlice({
  name: "keywords",
  initialState,
  reducers: {
    clearCurrentKeyword: (state) => {
      state.current = null;
    },
    setStateSuccess: (state) => {
      state.status = RequestStatus.Success;
    },
  },
  selectors: {
    selectKeywords: (sliceState) => sliceState.list,
    selectCurrentKeyword: (sliceState) => sliceState.current,
    selectIsDataLoading: (sliceState) =>
      sliceState.status === RequestStatus.Loading,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKeywords.pending, (state) => {
        state.list = [];
      })
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
        state.status = RequestStatus.Added;
      })
      .addCase(delKeyword.fulfilled, (state, _) => {
        state.status = RequestStatus.Deleted;
      })
      .addCase(addKeyword.rejected, (state, _) => {
        state.status = RequestStatus.FailedAdd;
      })
      .addCase(delKeyword.rejected, (state, _) => {
        state.status = RequestStatus.FailedDelete;
      })
      .addMatcher(
        isAnyOf(
          setKeyword.fulfilled,
          approveKeyword.fulfilled,
          rejectKeyword.fulfilled,
        ),
        (state, _) => {
          state.status = RequestStatus.Updated;
        },
      )
      .addMatcher(
        isAnyOf(
          setKeyword.rejected,
          approveKeyword.rejected,
          rejectKeyword.rejected,
        ),
        (state, _) => {
          state.status = RequestStatus.FailedUpdate;
        },
      )
      .addMatcher(
        isAnyOf(getKeyword.fulfilled, fetchKeywords.fulfilled),
        (state, _) => {
          state.status = RequestStatus.Success;
        },
      )
      .addMatcher(
        isAnyOf(
          fetchKeywords.pending,
          setKeyword.pending,
          getKeyword.pending,
          addKeyword.pending,
          approveKeyword.pending,
          rejectKeyword.pending,
          delKeyword.pending
        ), (state) => {
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addMatcher(
        isAnyOf(
          fetchKeywords.rejected,
          setKeyword.rejected,
          getKeyword.rejected,
          addKeyword.rejected,
          approveKeyword.rejected,
          rejectKeyword.rejected,
          delKeyword.rejected
        ), (state, action) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectKeywords,
  selectCurrentKeyword,
  selectSliceState,
  selectIsDataLoading,
} = keywordsSlice.selectors;
export const { clearCurrentKeyword, setStateSuccess } = keywordsSlice.actions;
export default keywordsSlice.reducer;

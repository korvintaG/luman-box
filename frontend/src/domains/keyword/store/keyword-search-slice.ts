import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import keywordAPI from "../api/keyword-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { KeywordList, KeywordSearchResult } from "../types/keyword-types";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { SliceComplexList, SliceList } from "../../../shared/types/types-for-slice";

export const initialState: SliceComplexList<KeywordSearchResult[]> = {
  list: undefined,
  status: RequestStatus.Idle,
  error: "",
};

/*export const fetchKeywords = createAsyncThunk(
  "fetchKeywords",
  keywordAPI.getEntities,
);*/

export const searchKeywords = createAsyncThunk(
  "searchKeywords",
  keywordAPI.searchEntity,
);

const keywordSearchSlice = createSlice({
  name: "keywordSearch",
  initialState,
  reducers: {
    setSliceStatus: (state, action) => {
      state.status = action.payload; //RequestStatus.Success;
    },
  },
  selectors: {
    selectKeywords: (sliceState) => sliceState.list,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchKeywords.pending, (state) => {
        state.list = undefined;
        state.status = RequestStatus.Finding;
        state.error = "";
      })
      .addCase(searchKeywords.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = RequestStatus.Success;
      })
      .addCase(searchKeywords.rejected, (state, action) => {
        state.error = action.error.message!;
        state.status = RequestStatus.FailedFind;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectKeywords,
  selectSliceState,
} = keywordSearchSlice.selectors;
export const { setSliceStatus } = keywordSearchSlice.actions;
export default keywordSearchSlice.reducer;

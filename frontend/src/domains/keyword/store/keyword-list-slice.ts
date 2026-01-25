import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import keywordAPI from "../api/keyword-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { KeywordList } from "../types/keyword-types";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { SliceComplexList, SliceList } from "../../../shared/types/types-for-slice";

export const initialState: SliceComplexList<KeywordList> = {
  list: undefined,
  status: RequestStatus.Idle,
  error: "",
};

/*export const fetchKeywords = createAsyncThunk(
  "fetchKeywords",
  keywordAPI.getEntities,
);*/

export const fetchKeywords = createAsyncThunk(
  "fetchKeywords",
  keywordAPI.getEntities,
);

const keywordListSlice = createSlice({
  name: "keywordList",
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
      .addCase(fetchKeywords.pending, (state) => {
        state.list = undefined;
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addCase(fetchKeywords.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = RequestStatus.Success;
      })
      .addCase(fetchKeywords.rejected, (state, action) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectKeywords,
  selectSliceState,
} = keywordListSlice.selectors;
export const { setSliceStatus } = keywordListSlice.actions;
export default keywordListSlice.reducer;

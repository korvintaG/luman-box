import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import sourceAPI from "../api/source-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { SourceList } from "../types/source-type";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { SliceList } from "../../../shared/types/types-for-slice";

export const initialState: SliceList<SourceList> = {
  list: [],
  status: RequestStatus.Idle,
  error: "",
};

export const fetchSources = createAsyncThunk(
  "fetchSources",
  sourceAPI.getEntities,
);
const sourceListSlice = createSlice({
  name: "sourceList",
  initialState,
  reducers: {
    setSliceStatus: (state, action) => {
      state.status = action.payload; 
    }
  },
  selectors: {
    selectSources: (sliceState) => sliceState.list,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSources.pending, (state) => {
        state.list = [];
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.list = action.payload;
      })
      .addCase(fetchSources.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      })
  },
});

export const {
  selectSources,
  selectSliceState,
  selectError,
} = sourceListSlice.selectors;
export const { setSliceStatus} = sourceListSlice.actions;
export default sourceListSlice.reducer;

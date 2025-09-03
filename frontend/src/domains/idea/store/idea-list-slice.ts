import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import ideaAPI from "../api/idea-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { IdeaList } from "../types/IdeaTypes";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { SliceList } from "../../../shared/types/types-for-slice";

export const initialState: SliceList<IdeaList> = {
  list: [],
  status: RequestStatus.Idle,
  error: "",
};

export const fetchIdeas = createAsyncThunk("fetchIdeas", ideaAPI.getEntities);
export const fetchIdeasBySrcKw = createAsyncThunk(
  "fetchIdeasBySrcKw",
  ideaAPI.getIdeasBySrcKw,
);
const ideaListSlice = createSlice({
  name: "ideaList",
  initialState,
  reducers: {
    setSliceStatus: (state, action) => {
      state.status = action.payload; //RequestStatus.Success;
    },
  },
  selectors: {
    selectIdeas: (sliceState) => sliceState.list,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(fetchIdeas.pending, fetchIdeasBySrcKw.pending),
        (state) => {
          state.list = [];
          state.status = RequestStatus.Loading;
          state.error = "";
          },
      )
      .addMatcher(
        isAnyOf(fetchIdeas.fulfilled, fetchIdeasBySrcKw.fulfilled),
        (state, action) => {
          state.list = action.payload;
          state.status = RequestStatus.Success;
        },
      )
      .addMatcher(
        isAnyOf(fetchIdeas.rejected, fetchIdeasBySrcKw.rejected), 
        (state, action) => {
          state.status = RequestStatus.Failed;
          state.error = action.error.message!;
          if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectIdeas,
  selectSliceState,
} = ideaListSlice.selectors;
export const { setSliceStatus } = ideaListSlice.actions;
export default ideaListSlice.reducer;

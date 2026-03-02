import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import ideaAPI from "../api/idea-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { IdeaType } from "../types/IdeaTypes";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { SliceList } from "../../../shared/types/types-for-slice";
import type { RootState } from "../../../shared/services/store";

export const initialState: SliceList<IdeaType> = {
  list: [],
  status: RequestStatus.Idle,
  error: "",
};

export const fetchIdeaTypes = createAsyncThunk<
  IdeaType[],
  void,
  { state: RootState }
>(
  "ideaTypes/fetchIdeaTypes",
  ideaAPI.getIdeaTypes,
  {
    condition: (_, { getState }) => {
      const { ideaTypes } = getState();
      const alreadyLoaded = ideaTypes.list.length > 0;
      const isLoading = ideaTypes.status === RequestStatus.Loading;
      return !alreadyLoaded && !isLoading;
    },
  },
);
const ideaTypesSlice = createSlice({
  name: "ideaTypes",
  initialState,
  reducers: {
    setSliceStatus: (state, action) => {
      state.status = action.payload; //RequestStatus.Success;
    },
  },
  selectors: {
    selectIdeaTypes: (sliceState) => sliceState.list,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(fetchIdeaTypes.pending),
        (state) => {
          state.list = [];
          state.status = RequestStatus.Loading;
          state.error = "";
          },
      )
      .addMatcher(
        isAnyOf(fetchIdeaTypes.fulfilled),
        (state, action) => {
          state.list = action.payload;
          state.status = RequestStatus.Success;
        },
      )
      .addMatcher(
        isAnyOf(fetchIdeaTypes.rejected), 
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
  selectIdeaTypes,
  selectSliceState,
} = ideaTypesSlice.selectors;
export const { setSliceStatus } = ideaTypesSlice.actions;
export default ideaTypesSlice.reducer;

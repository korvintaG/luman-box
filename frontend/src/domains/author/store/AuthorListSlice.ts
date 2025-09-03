import { 
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import authorAPI from "../api/author-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { AuthorList } from "../types/author-type";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { SliceList } from "../../../shared/types/types-for-slice";

export const initialState: SliceList<AuthorList> = {
  list: [],
  status: RequestStatus.Idle,
  error: ""
};

export const fetchAuthors = createAsyncThunk(
  "fetchAuthors",
  authorAPI.getEntities,
);

const authorListSlice = createSlice({
  name: "authorList",
  initialState,
  reducers: {
    setSliceStatus: (state, action) => {
      state.status = action.payload; 
    },
  },
  selectors: {
    selectAuthors: (sliceState) => sliceState.list,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.status = RequestStatus.Loading;
        state.list = [];
        state.error = "";
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = RequestStatus.Success;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      })
  },
});

export const {
  selectError,
  selectAuthors,
  selectSliceState,
} = authorListSlice.selectors;
export const { setSliceStatus } = authorListSlice.actions; 
export default authorListSlice.reducer;

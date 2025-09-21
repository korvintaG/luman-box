import { 
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import authorAPI from "../api/author-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { AuthorDetail } from "../types/author-type";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { SliceDetail } from "../../../shared/types/types-for-slice";

export const initialState: SliceDetail<AuthorDetail> = {
  current: null,
  status: RequestStatus.Idle,
  error: "",
  newID: undefined,
};

export const setAuthor = createAsyncThunk("setAuthor", authorAPI.setEntity);
export const approveAuthor = createAsyncThunk(
  "approveAuthor",
  authorAPI.approveEntity,
);
export const rejectAuthor = createAsyncThunk(
  "rejectAuthor",
  authorAPI.rejectEntity,
);

export const toModerateAuthor = createAsyncThunk(
  "toModerateAuthor",
  authorAPI.toModerateEntity,
);

export const getAuthor = createAsyncThunk("getAuthor", authorAPI.getEntity);
export const addAuthor = createAsyncThunk("addAuthor", authorAPI.addEntity);
export const delAuthor = createAsyncThunk("delAuthor", authorAPI.delEntity);

const authorDetailsSlice = createSlice({
  name: "authorDetails",
  initialState,
  reducers: {
    clearCurrentAuthor: (state) => {
      state.current = null;
    },
    setSliceStatus: (state, action) => {
      state.status = action.payload; //RequestStatus.Success;
    },
    setNewImageName: (state, action) => {
      if (state.current)
        state.current.new_image_URL = action.payload; //RequestStatus.Success;
    },
  },
  selectors: {
    selectNewID: (sliceState) => sliceState.newID,
    selectCurrentAuthor: (sliceState) => sliceState.current,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthor.pending, (state) => {
        state.current = null;
      })
      .addCase(getAuthor.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(addAuthor.fulfilled, (state, action) => {
        state.status = RequestStatus.Added;
        state.newID = action.payload.id;
      })
      .addCase(delAuthor.fulfilled, (state, _) => {
        state.status = RequestStatus.Deleted;
      })
      .addCase(addAuthor.rejected, (state, _) => {
        state.status = RequestStatus.FailedAdd;
      })
      .addCase(getAuthor.rejected, (state, _) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(delAuthor.rejected, (state, _) => {
        state.status = RequestStatus.FailedDelete;
      })
      .addCase(toModerateAuthor.fulfilled, (state, _) => {
        state.status = RequestStatus.SendToModerating; 
      })
      .addMatcher(
        isAnyOf(
          setAuthor.rejected,
          approveAuthor.rejected,
          rejectAuthor.rejected,
          toModerateAuthor.rejected,
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
        isAnyOf(getAuthor.fulfilled),
        (state, _) => {
          state.status = RequestStatus.Success;
        },
      )
      .addMatcher(
        isAnyOf(
          setAuthor.pending,
          approveAuthor.pending,
          rejectAuthor.pending,
          getAuthor.pending,
          addAuthor.pending,
          delAuthor.pending,
          toModerateAuthor.pending,
        ), (state) => {
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addMatcher(
        isAnyOf(
          setAuthor.rejected,
          approveAuthor.rejected,
          rejectAuthor.rejected,
          getAuthor.rejected,
          addAuthor.rejected,
          delAuthor.rejected,
          toModerateAuthor.rejected,
      ), (state, action) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectCurrentAuthor,
  selectSliceState,
  selectNewID,
} = authorDetailsSlice.selectors;
export const { clearCurrentAuthor, setSliceStatus, setNewImageName } = authorDetailsSlice.actions; 
export default authorDetailsSlice.reducer;

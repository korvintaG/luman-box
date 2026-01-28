import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import sourceAPI from "../api/source-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { SourceDetail } from "../types/source-type";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { SliceDetail } from "../../../shared/types/types-for-slice";
import { toModerateAuthor } from "../../author/store/AuthorDetailsSlice";

export const initialState: SliceDetail<SourceDetail> = {
  current: null,
  status: RequestStatus.Idle,
  error: "",
  newID: undefined,
};

export const getSource = createAsyncThunk("getSource", sourceAPI.getEntity);
export const addSource = createAsyncThunk("addSource", sourceAPI.addEntity);
export const setSource = createAsyncThunk("setSource", sourceAPI.setEntity);
export const delSource = createAsyncThunk("delSource", sourceAPI.delEntity);
export const approveSource = createAsyncThunk(
  "approveSource",
  sourceAPI.approveEntity,
);
export const rejectSource = createAsyncThunk(
  "rejectSource",
  sourceAPI.rejectEntity,
);

export const toModerateSource = createAsyncThunk(
  "toModerateSource",
  sourceAPI.toModerateEntity,
);

const sourceDetailsSlice = createSlice({
  name: "sourceDetails",
  initialState,
  reducers: {
    clearCurrentSource: (state) => {
      state.current = null;
    },
    setSliceStatus: (state, action) => {
      state.status = action.payload; //RequestStatus.Success;
    },
  },
  selectors: {
    selectCurrentSource: (sliceState) => sliceState.current,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
    selectNewID: (sliceState) => sliceState.newID,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSource.pending, (state) => {
        state.current = null;
      })
      .addCase(getSource.fulfilled, (state, action) => {
        state.current = action.payload;
        // {...action.payload, new_image_URL:null};
      })
      .addCase(addSource.fulfilled, (state, action) => {
        state.status = RequestStatus.Added;
        state.newID = action.payload.id;
      })
      .addCase(toModerateSource.fulfilled, (state, _) => {
        state.status = RequestStatus.SendToModerating;
      })

      .addCase(delSource.fulfilled, (state, _) => {
        state.status = RequestStatus.Deleted;
      })
      .addCase(addSource.rejected, (state, _) => {
        state.status = RequestStatus.FailedAdd;
      })
      .addCase(delSource.rejected, (state, _) => {
        state.status = RequestStatus.FailedDelete;
      })
      .addMatcher(
        isAnyOf(
          setSource.fulfilled,
          approveSource.fulfilled,
          rejectSource.fulfilled,
        ),
        (state) => {
          state.status = RequestStatus.Updated;
        },
      )
      .addMatcher(
        isAnyOf(
          setSource.rejected,
          approveSource.rejected,
          rejectSource.rejected,
          toModerateAuthor.rejected,
        ),
        (state) => {
          state.status = RequestStatus.FailedUpdate;
        },
      )
      .addMatcher(
        isAnyOf(
          getSource.rejected
        ),
        (state) => {
          state.status = RequestStatus.Failed;
        },
      )
      .addMatcher(
        isAnyOf(getSource.fulfilled),
        (state) => {
          state.status = RequestStatus.Success;
        },
      )
      .addMatcher(
        isAnyOf(
          getSource.pending,
          addSource.pending,
          setSource.pending,
          delSource.pending,
          approveSource.pending,
          toModerateAuthor.pending,
          rejectSource.pending
        ), (state) => {
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addMatcher(        
        isAnyOf(
          getSource.rejected,
          addSource.rejected,
          setSource.rejected,
          delSource.rejected,
          toModerateSource.rejected,
          approveSource.rejected,
          rejectSource.rejected
        ), (state, action) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectCurrentSource,
  selectSliceState,
  selectError, 
  selectNewID,
} = sourceDetailsSlice.selectors;
export const { clearCurrentSource, setSliceStatus} = sourceDetailsSlice.actions;
export default sourceDetailsSlice.reducer;

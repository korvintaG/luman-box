import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isAnyOf,
} from "@reduxjs/toolkit";
import { ListToWork, ErrorAction } from "../../../shared/utils/ForSliceUtils";
import keywordAPI from "../api/keyword-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { KeywordShort, KeywordDetail, KeywordList } from "../types/KeywordTypes";
import { RequestStatus, RequestStatusValue } from "../../../shared/types/types-for-hooks";
import { SliceDetail } from "../../../shared/types/types-for-slice";

export const initialState: SliceDetail<KeywordDetail> = {
  current: null,
  status: RequestStatus.Idle,
  error: "",
  newID: undefined,
};

export const setKeyword = createAsyncThunk("setKeyword", keywordAPI.setEntity);
export const getKeyword = createAsyncThunk("getKeyword", keywordAPI.getEntity);
export const addKeyword = createAsyncThunk("addKeyword", keywordAPI.addEntity);
export const approveKeyword = createAsyncThunk(
  "approveKeyword",
  keywordAPI.approveEntity,
);
export const rejectKeyword = createAsyncThunk(
  "approveKeyword",
  keywordAPI.rejectEntity, 
);

export const toModerateKeyword = createAsyncThunk(
  "toModerateKeyword",
  keywordAPI.toModerateEntity,
);


export const delKeyword = createAsyncThunk("delKeyword", keywordAPI.delEntity);

const keywordDetailSlice = createSlice({
  name: "keywordDetail",
  initialState,
  reducers: {
    setSliceStatus: (state, action: PayloadAction<RequestStatusValue>) => {
      state.status = action.payload; //RequestStatus.Success;
    },
    clearCurrentKeyword: (state) => {
      state.current = null;
    },
    setStateSuccess: (state) => {
      state.status = RequestStatus.Success;
    },
  },
  selectors: {
    selectCurrentKeyword: (sliceState) => sliceState.current,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
    selectNewID: (sliceState) => sliceState.newID,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKeyword.pending, (state) => {
        state.current = null;
      })
      .addCase(getKeyword.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(addKeyword.fulfilled, (state, action) => {
        state.status = RequestStatus.Added;
        state.newID = action.payload.id;
      })
      .addCase(toModerateKeyword.fulfilled, (state, _) => {
        state.status = RequestStatus.SendToModerating;
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
          toModerateKeyword.rejected,
        ),
        (state, _) => {
          state.status = RequestStatus.FailedUpdate;
        },
      )
      .addMatcher(
        isAnyOf(getKeyword.fulfilled),
        (state, _) => {
          state.status = RequestStatus.Success;
        },
      )
      .addMatcher(
        isAnyOf(
          setKeyword.pending,
          getKeyword.pending,
          addKeyword.pending,
          approveKeyword.pending,
          rejectKeyword.pending,
          delKeyword.pending,
          toModerateKeyword.pending,
        ), (state) => {
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addMatcher(
        isAnyOf(
          setKeyword.rejected,
          getKeyword.rejected,
          addKeyword.rejected,
          approveKeyword.rejected,
          rejectKeyword.rejected,
          delKeyword.rejected,
          toModerateKeyword.rejected,
        ), (state, action) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectCurrentKeyword,
  selectSliceState,
  selectNewID,
} = keywordDetailSlice.selectors;
export const { clearCurrentKeyword, setStateSuccess, setSliceStatus } = keywordDetailSlice.actions;
export default keywordDetailSlice.reducer;

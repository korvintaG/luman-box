import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isAnyOf,
} from "@reduxjs/toolkit";
import { ListToWork, ErrorAction } from "../../../shared/utils/ForSliceUtils";
import ideaAPI from "../api/idea-api";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { IdeaDetail, IdeaList } from "../types/IdeaTypes";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { isArray } from "lodash";
import { SliceDetail } from "../../../shared/types/types-for-slice";

export const initialState: SliceDetail<IdeaDetail> = {
  current: null,
  status: RequestStatus.Idle,
  error: "",
  newID: undefined,
};

export const getIdea = createAsyncThunk("getIdea", ideaAPI.getEntity);
export const getIdeaBySrcKw = createAsyncThunk(
  "getIdeaBySrcKw",
  ideaAPI.getIdeaBySourceKeyword,
);
export const addIdea = createAsyncThunk("addIdea", ideaAPI.addEntity);
export const setIdea = createAsyncThunk("setIdea", ideaAPI.setEntity);
export const delIdea = createAsyncThunk("delIdea", ideaAPI.delEntity);
export const approveIdea = createAsyncThunk("approveIdea",ideaAPI.approveEntity);
export const toModerateIdea = createAsyncThunk("toModerateIdea", ideaAPI.toModerateEntity);
export const rejectIdea = createAsyncThunk("rejectIdea", ideaAPI.rejectEntity);
export const attitudeIdea = createAsyncThunk("attitudeIdea", ideaAPI.attitudeIdea);

const ideaDetailSlice = createSlice({
  name: "ideaDetail",
  initialState,
  reducers: {
    setSliceStatus: (state, action) => {
      state.status = action.payload; //RequestStatus.Success;
    },
    clearCurrentIdea: (state) => {
      state.current = null;
    },
  },
  selectors: {
    selectNewID: (sliceState) => sliceState.newID,
    selectCurrentIdea: (sliceState) => sliceState.current,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(attitudeIdea.pending, (state, _) => {
        //state.status = RequestStatus.Attituding;
      })
      .addCase(attitudeIdea.fulfilled, (state, _) => {
        //state.status = RequestStatus.Attituded;
      })
      .addCase(addIdea.fulfilled, (state, action) => {
        state.status = RequestStatus.Added;
        state.newID = action.payload.id;
      })
      .addCase(delIdea.fulfilled, (state, _) => {
        state.status = RequestStatus.Deleted;
      })
      .addCase(addIdea.rejected, (state, action) => {
        state.status = RequestStatus.FailedAdd;
        state.error = action.error.message!

      })
      .addCase(delIdea.rejected, (state, _) => {
        state.status = RequestStatus.FailedDelete;
      })
      .addCase(toModerateIdea.fulfilled, (state, _) => {
        state.status = RequestStatus.SendToModerating;
      })
      .addMatcher(
        isAnyOf(setIdea.fulfilled, approveIdea.fulfilled, rejectIdea.fulfilled),
        (state) => {
          state.status = RequestStatus.Updated; 
        },
      )
      .addMatcher(
        isAnyOf(setIdea.rejected, approveIdea.rejected, rejectIdea.rejected, attitudeIdea.rejected, toModerateIdea.rejected),
        (state, action) => {
          state.status = RequestStatus.FailedUpdate;
          if (isArray(action.error.message))
            state.error = action.error.message.join('\n');
          else
            state.error = action.error.message!
        },
      )
      .addMatcher(isAnyOf(getIdea.pending, getIdeaBySrcKw.pending), (state) => {
        state.current = null;
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addMatcher(
        isAnyOf(getIdea.fulfilled, getIdeaBySrcKw.fulfilled),
        (state, action) => {
          state.current = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          getIdea.fulfilled,
          getIdeaBySrcKw.fulfilled,
        ),
        (state) => {
          state.status = RequestStatus.Success;
        },
      )
      .addMatcher( 
        isAnyOf(
          addIdea.pending,
          setIdea.pending,
          delIdea.pending,
          approveIdea.pending,
          rejectIdea.pending,
          toModerateIdea.pending,
         // attitudeIdea.pending
        ), (state) => {
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addMatcher(
        isAnyOf(
          getIdea.rejected, 
          getIdeaBySrcKw.rejected
        ), (state, action) => {
        state.error = action.error.message!;
        //console.log('state.error', state.error);
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectCurrentIdea,
  selectSliceState,
  selectNewID,
} = ideaDetailSlice.selectors;
export const { clearCurrentIdea, setSliceStatus } =
  ideaDetailSlice.actions;
export default ideaDetailSlice.reducer;

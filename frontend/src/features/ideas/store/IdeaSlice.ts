import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isAnyOf,
} from "@reduxjs/toolkit";
import { ListToWork, ErrorAction } from "../../../shared/utils/ForSliceUtils";
import ideaAPI from "../api/ideaAPI";
import { isUnauthorizedError } from "../../../shared/utils/utils";
import { Idea } from "../IdeaTypes";
import { RequestStatus } from "../../../shared/common-types";

export const initialState: ListToWork<Idea> = {
  list: [],
  current: null,
  status: RequestStatus.Idle,
  error: "",
};

export const fetchIdeas = createAsyncThunk("fetchIdeas", ideaAPI.getIdeas);
export const fetchIdeasBySrcKw = createAsyncThunk(
  "fetchIdeasBySrcKw",
  ideaAPI.getIdeasBySrcKw,
);
export const getIdea = createAsyncThunk("getIdea", ideaAPI.getIdea);
export const getIdeaBySrcKw = createAsyncThunk(
  "getIdeaBySrcKw",
  ideaAPI.getIdeaBySourceKeyword,
);
export const addIdea = createAsyncThunk("addIdea", ideaAPI.addIdea);
export const setIdea = createAsyncThunk("setIdea", ideaAPI.setIdea);
export const delIdea = createAsyncThunk("delIdea", ideaAPI.delIdea);
export const approveIdea = createAsyncThunk("approveIdea",ideaAPI.approveIdea);
export const rejectIdea = createAsyncThunk("approveIdea", ideaAPI.rejectIdea);
export const attitudeIdea = createAsyncThunk("attitudeIdea", ideaAPI.attitudeIdea);

/*export function isPendingIdeaAction(action: PayloadAction) {
  return action.type.endsWith("pending") && action.type.includes("Idea") && !action.type.includes("attitude");
}

export function isRejectedIdeaAction(action: PayloadAction) {
  return action.type.endsWith("rejected") && action.type.includes("Idea");
}*/

/**
 * Слайс для идей
 */
const ideasSlice = createSlice({
  name: "ideas",
  initialState,
  reducers: {
    clearCurrentIdea: (state) => {
      state.current = null;
    },
    setStateSuccess: (state) => {
      state.status = RequestStatus.Success;
    },
    resetStatus: (state) => {
      state.status = RequestStatus.Idle;
    },
  },
  selectors: {
    selectIdeas: (sliceState) => sliceState.list,
    selectCurrentIdea: (sliceState) => sliceState.current,
    selectIsDataLoading: (sliceState) =>
      sliceState.status === RequestStatus.Loading,
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
      .addCase(addIdea.fulfilled, (state, _) => {
        state.status = RequestStatus.Added;
      })
      .addCase(delIdea.fulfilled, (state, _) => {
        state.status = RequestStatus.Deleted;
      })
      .addCase(addIdea.rejected, (state, _) => {
        state.status = RequestStatus.FailedAdd;
      })
      .addCase(delIdea.rejected, (state, _) => {
        state.status = RequestStatus.FailedDelete;
      })
      .addMatcher(
        isAnyOf(setIdea.fulfilled, approveIdea.fulfilled, rejectIdea.fulfilled),
        (state) => {
          state.status = RequestStatus.Updated;
        },
      )
      .addMatcher(
        isAnyOf(setIdea.rejected, approveIdea.rejected, rejectIdea.rejected, attitudeIdea.rejected),
        (state, action) => {
          state.status = RequestStatus.FailedUpdate;
          state.error = action.error.message!
        },
      )
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
          fetchIdeas.fulfilled,
          fetchIdeasBySrcKw.fulfilled,
          //attitudeIdea.fulfilled
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
         // attitudeIdea.pending
        ), (state) => {
        state.status = RequestStatus.Loading;
        state.error = "";
      })
      .addMatcher(
        isAnyOf(
          fetchIdeas.rejected, 
          fetchIdeasBySrcKw.rejected,
          getIdea.rejected, 
          getIdeaBySrcKw.rejected
        ), (state, action) => {
        state.error = action.error.message!;
        if (isUnauthorizedError(state.error))
          state.status = RequestStatus.FailedUnAuth;
      });
  },
});

export const {
  selectError,
  selectIdeas,
  selectCurrentIdea,
  selectSliceState,
  selectIsDataLoading,
} = ideasSlice.selectors;
export const { clearCurrentIdea, setStateSuccess, resetStatus } =
  ideasSlice.actions;
export default ideasSlice.reducer;

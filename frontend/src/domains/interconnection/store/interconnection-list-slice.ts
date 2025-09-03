import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import interconnectionAPI from "../api/interconnection-api";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { InterconnectionList } from "../types/query-types";

type InterconnectionListState = {
  list?: InterconnectionList,  // для списка взаимосвязей
  status: RequestStatus,
  error: string,
}

export const initialState: InterconnectionListState = {
  status: RequestStatus.Idle,
  error: "",
};

export const fetchInterconnections = createAsyncThunk("fetchInterconnections", interconnectionAPI.getEntities);



const interconnectionListSlice = createSlice({
  name: "interconnectionList",
  initialState,
  reducers: {
    setSliceStatus: (state, action) => {
      state.status = action.payload; //RequestStatus.Success;
    },
  },
  selectors: {
    selectInterconnections: (sliceState) => sliceState.list,
    selectSliceState: (sliceState) => sliceState.status,
    selectError: (sliceState) => sliceState.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterconnections.pending, (state, _) => {
        state.status = RequestStatus.Loading;
        state.error = '';
      })
      .addCase(fetchInterconnections.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.list = action.payload;
      })
      .addCase(fetchInterconnections.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.error = action.error.message!;
      },
      )
  }
})

export const {
  selectInterconnections,
  selectSliceState,
  selectError,
} = interconnectionListSlice.selectors;
export const { setSliceStatus } = interconnectionListSlice.actions;
export default interconnectionListSlice.reducer;

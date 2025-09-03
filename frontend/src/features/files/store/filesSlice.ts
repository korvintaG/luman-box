import {
    createAsyncThunk,
    createSlice,
  } from "@reduxjs/toolkit";
  import { SliceToWork } from "../../../shared/utils/ForSliceUtils";
  import filesAPI from "../api/filesAPI";
  import { RequestStatus } from "../../../shared/types/types-for-hooks";

  
  export const initialState: SliceToWork<string> = {
    current: null,
    status: RequestStatus.Idle,
    error: "",
  };
  
  export const uploadFile = createAsyncThunk("uploadFile", filesAPI.uploadFile);
  
  
  /**
   * Слайс для загрузки файлов
   */
  const filesSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
      setCurrentFileName: (state, action) => {
        state.current = action.payload;
      },
      resetState : (state) => {
        state.current = undefined;
        state.status = RequestStatus.Idle;
      },
      setSliceStatus: (state, action) => {
        state.status = action.payload; //RequestStatus.Success;
      },
    },
    selectors: {
      selectCurrentFile: (sliceState) => sliceState.current,
      selectSliceState: (sliceState) => sliceState.status,
      selectError: (sliceState) => sliceState.error,
    },
    extraReducers: (builder) => {
      builder
        .addCase(uploadFile.pending, (state) => {
          state.current = null;
          state.status = RequestStatus.Loading;
          state.error = "";
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
          state.current = action.payload.fileName;
          state.status = RequestStatus.Success;
        })
        .addCase(uploadFile.rejected, (state, action) => {
          state.status = RequestStatus.FailedAdd;
          state.error = action.error.message!;
        });
    },
  });
  
  export const {
    selectError,
    selectCurrentFile,
    selectSliceState
  } = filesSlice.selectors;
  export const { setCurrentFileName, setSliceStatus, resetState } = filesSlice.actions;
  export default filesSlice.reducer;
  
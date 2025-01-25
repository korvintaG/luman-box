import { createAsyncThunk, createSlice, isAnyOf , PayloadAction } from '@reduxjs/toolkit';
import { ServerResponse,LoginResult, RequestStatus, User } from '../../utils/type'
import { ListToWork, isFullFilledAction, isPendingAction, isRejectedAction, ErrorAction } from '../utils'
import LumanAPI from '../../utils/luman-api'
import { setCookie } from '../../utils/cookie';

export const enum AuthStatus {
    Idle = 'idle',
    Requesting = 'requesting',
    Success = 'success',
    FailedLogin = 'failedLogin',
    FailedLogout = 'failedLogout',
    FailedGetUser = 'failedGetUser'
}

export type AuthData = {
    status: AuthStatus,
    currentLogin: ServerResponse<LoginResult> | null
    currentUser: User | null
    error: string
}

export const initialState:AuthData = {
  status: AuthStatus.Idle,
  currentLogin: null,
  currentUser: null,
  error: ''
};

export const login = createAsyncThunk('login', LumanAPI.login);
export const getUser = createAsyncThunk('getUser', LumanAPI.getUser);
export const logout = createAsyncThunk('logout', LumanAPI.logout);


/**
 * Слайс для авторизации
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status=AuthStatus.Idle;
    },
    setStatus: (state, newStatus) => {
      state.status=newStatus.payload;
    },
    resetAuth: (state) => {
      state.status=AuthStatus.Idle;
      state.currentLogin=null
      state.currentUser=null
      state.error=''
    },
  },
  selectors: {
    selectSliceStatus: (sliceData) => sliceData.status,
    selectCurrentUser: (sliceData) => sliceData.currentUser,  
    selectCurrentLogin: (sliceData) => sliceData.currentLogin,  
    selectError: (sliceData) => sliceData.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error='';
        state.currentLogin=null;
        state.status=AuthStatus.Requesting
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status=AuthStatus.Success
        state.currentLogin=action.payload
        state.currentUser=state.currentLogin.user
        setCookie('accessToken', state.currentLogin.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status=AuthStatus.FailedLogin;
        state.error = action.error.message!;
      })
      .addCase(getUser.pending, (state) => {
        state.error='';
        state.currentUser=null;
        state.status=AuthStatus.Requesting
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status=AuthStatus.Success
        state.currentUser=action.payload
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status=AuthStatus.FailedGetUser;
        state.error = action.error.message!;
      })
      .addCase(logout.pending, (state) => {
        state.error='';
        state.status=AuthStatus.Requesting
      })
      .addCase(logout.fulfilled, (state) => {
        state.status=AuthStatus.Success
        state.currentUser=null
        state.currentLogin=null
        setCookie('accessToken', '', {expires: new Date(0)});
        setCookie('refreshToken', '', {expires: new Date(0)});
      })
      .addCase(logout.rejected, (state, action) => {
        state.status=AuthStatus.FailedLogout;
        state.error = action.error.message!;
      })
  }
});

export const { selectError, selectSliceStatus, selectCurrentUser, selectCurrentLogin} = authSlice.selectors;
export const { resetStatus, resetAuth, setStatus } = authSlice.actions;
export default authSlice.reducer;

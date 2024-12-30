import { AsyncThunk, SerializedError, UnknownAction , createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatusValue } from '../utils/type'

const hasPrefix = (action: UnknownAction, prefix: string) => action.type.startsWith(prefix);
const isRejected = (action: UnknownAction) => action.type.endsWith("/rejected");

export type ErrorAction = PayloadAction<unknown, string, {
  arg: string;
  requestId: string;
  requestStatus: "rejected";
  aborted: boolean;
  condition: boolean;
} & ({
  rejectedWithValue: true;
} | ({
  rejectedWithValue: false;
} & {})), SerializedError>;

/* const isRejectedAction = (prefix: string) => (
  action: UnknownAction
): action is UnknownAction => { // Note: this cast to AnyAction could also be `any` or whatever fits your case best - like if you had standardized errors and used `rejectWithValue`
  return hasPrefix(action, prefix) && isRejected(action);
};*/

export function isRejectedAction(action: PayloadAction) {
  return action.type.endsWith('rejected');
} 

export function isFullFilledAction(action: PayloadAction) {
  return action.type.endsWith('fulfilled');
} 

export function isPendingAction(action: PayloadAction) {
  return action.type.endsWith('pending');
}  


type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface ListToWork<T> {
    list: T[]; 
    current: T | null;
    status: RequestStatusValue,
    error: string;
  }

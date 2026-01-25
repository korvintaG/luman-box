import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authorDetailsSliceReducer from "../../domains/author/store/AuthorDetailsSlice";
import authorListSliceReducer from "../../domains/author/store/AuthorListSlice";
import sourceDetailsSliceReducer from "../../domains/source/store/SourceDetailsSlice";
import sourceListSliceReducer from "../../domains/source/store/SourceListSlice";
import ideaDetailSliceReducer from "../../domains/idea/store/idea-details-slice";
import ideaListSliceReducer from "../../domains/idea/store/idea-list-slice";
import keywordDetailSliceReducer from "../../domains/keyword/store/keyword-detail-slice";
import keywordListSliceReducer from "../../domains/keyword/store/keyword-list-slice";
import keywordAddSliceReducer from "../../domains/keyword/store/keyword-add-slice";
import authSliceReducer from "../../features/auth/store/AuthSlice";
import interconnectionListReducer from "../../domains/interconnection/store/interconnection-list-slice";
import interconnectionAddReducer from "../../domains/interconnection/store/interconnection-add-slice";
import interconnectionEditReducer from "../../domains/interconnection/store/interconnection-edit-slice";
import filesReducer from "../../features/files/store/filesSlice";
import keywordSearchReducer from "../../domains/keyword/store/keyword-search-slice"

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from "react-redux";

export const rootReducer = combineReducers({
  authorDetails: authorDetailsSliceReducer,
  authorList: authorListSliceReducer,
  sourceDetails: sourceDetailsSliceReducer,
  sourceList: sourceListSliceReducer,
  ideaDetail: ideaDetailSliceReducer,
  ideaList: ideaListSliceReducer,
  keywordDetail: keywordDetailSliceReducer,
  keywordList: keywordListSliceReducer,
  keywordAdd: keywordAddSliceReducer,
  keywordSearch: keywordSearchReducer,
  auth: authSliceReducer,
  interconnectionList: interconnectionListReducer,
  interconnectionAdd: interconnectionAddReducer,
  interconnectionEdit: interconnectionEditReducer,
  files: filesReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export const logger = (store: any) => (next: any) => (action: any) => {
  console.group(action.type);
  console.info("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  console.groupEnd();
  return result;
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export const useDispatch: () => AppDispatch = () => dispatchHook();

export default store;

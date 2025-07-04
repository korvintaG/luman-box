import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authorsSliceReducer from "../../features/authors/store/AuthorSlice";
import sourcesSliceReducer from "../../features/sources/store/SourceSlice";
import ideasSliceReducer from "../../features/ideas/store/IdeaSlice";
import keywordsSliceReducer from "../../features/keywords/store/KeywordSlice";
import authSliceReducer from "../../features/auth/store/AuthSlice";
import interconnectionsReducer from "../../features/interconnections/store/InterconnectionSlice";
import filesReducer from "../../features/files/store/filesSlice";

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from "react-redux";

export const rootReducer = combineReducers({
  authors: authorsSliceReducer,
  sources: sourcesSliceReducer,
  ideas: ideasSliceReducer,
  keywords: keywordsSliceReducer,
  auth: authSliceReducer,
  interconnections: interconnectionsReducer,
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

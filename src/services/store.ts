import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authorsSliceReducer from '../slices/authors';
import sourcesSliceReducer from '../slices/sources';
import ideasSliceReducer from '../slices/ideas';
import keywordsSliceReducer from '../slices/keywords';

import {
    TypedUseSelectorHook,
    useDispatch as dispatchHook,
    useSelector as selectorHook
  } from 'react-redux';
  

export const rootReducer = combineReducers({
    authors: authorsSliceReducer,
    sources: sourcesSliceReducer,
    ideas: ideasSliceReducer,
    keywords: keywordsSliceReducer,
});
    
  export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
  });
  

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export default store;

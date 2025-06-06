import { fetchKeywords } from "../../../../features/keywords/store/KeywordSlice";
import store from "../../../../shared/services/store";

export async function keywordsLoad() {
  const result = await store.dispatch(fetchKeywords());
  const state = store.getState();

  if (fetchKeywords.fulfilled.match(result)) {
    return null;
  }
  
  throw new Error(state.keywords.error); 
}
import { fetchSources } from "../store/SourceListSlice";
import store from "../../../shared/services/store";

export async function sourceListLoad() {
  const result = await store.dispatch(fetchSources());
  const state = store.getState();

  if (fetchSources.fulfilled.match(result)) {
    return null;
  }
  
  throw new Error(state.sourceList.error); 
}
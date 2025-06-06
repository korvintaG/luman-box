import { fetchSources } from "../../../../features/sources/store/SourceSlice";
import store from "../../../../shared/services/store";

export async function sourcesLoad() {
  const result = await store.dispatch(fetchSources());
  const state = store.getState();

  if (fetchSources.fulfilled.match(result)) {
    return null;
  }
  
  throw new Error(state.sources.error); 
}
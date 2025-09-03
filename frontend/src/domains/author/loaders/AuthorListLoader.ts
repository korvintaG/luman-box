import { fetchAuthors } from "../store/AuthorListSlice";
import store from "../../../shared/services/store";

export async function authorsLoad() {
  const result = await store.dispatch(fetchAuthors());
  const state = store.getState();

  if (fetchAuthors.fulfilled.match(result)) {
    return null;
  }
  
  throw new Error(state.authorList.error); 
}
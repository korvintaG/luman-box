import store from "../../../../shared/services/store";
import { EditAccessStatus, getEditAccess } from "../../../../shared/utils/utils";
import { Source } from "../../../../features/sources/SourceTypes";
import { fetchAuthors } from "../../../../features/authors/store/AuthorSlice";

export async function sourceAdditionalLoad(source: Source | null) {
    const state = store.getState();
    const currentUser = state.auth.currentUser;
  
    const editAccessStatus = source ?
      getEditAccess(String(source.id), currentUser, source) :
      EditAccessStatus.Editable;
  
      if (editAccessStatus !== EditAccessStatus.Readonly && state.authors.list.length === 0) {
        const result = await store.dispatch(fetchAuthors());
      if (!fetchAuthors.fulfilled.match(result))
        throw new Error(state.authors.error);
    }
  }
  
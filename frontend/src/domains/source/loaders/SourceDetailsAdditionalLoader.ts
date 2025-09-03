import store from "../../../shared/services/store";
import { EditAccessStatus, getEditAccess } from "../../../shared/utils/utils";
import { SourceDetail } from "../types/source-type";
import { fetchAuthors } from "../../author";
import { resetState } from "../../../features/files/store/filesSlice";

export async function sourceAdditionalLoad(source: SourceDetail | null) {
    store.dispatch(resetState());
    const state = store.getState();
    const currentUser = state.auth.currentUser;
  
    const editAccessStatus = source ?
      getEditAccess(String(source.id), currentUser, source) :
      EditAccessStatus.Editable;
  
      if (editAccessStatus !== EditAccessStatus.Readonly && state.authorList.list.length === 0) {
        const result = await store.dispatch(fetchAuthors());
      if (!fetchAuthors.fulfilled.match(result))
        throw new Error(state.authorList.error);
    }
  }
  
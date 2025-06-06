import store from "../../../../shared/services/store";
import { fetchKeywords } from "../../../../features/keywords/store/KeywordSlice";
import { fetchSources } from "../../../../features/sources/store/SourceSlice";
import { EditAccessStatus, getEditAccess } from "../../../../shared/utils/utils";
import { Idea } from "../../../../features/ideas/IdeaTypes";

export async function ideaAdditionalLoad(idea: Idea | null) {
    const state = store.getState();
    const currentUser = state.auth.currentUser;
  
    const editAccessStatus = idea ?
      getEditAccess(String(idea.id), currentUser, idea) :
      EditAccessStatus.Editable;
  
    if (state.keywords.list.length === 0) {// всегда тянем ключевые слова
      const resultKeywords = await store.dispatch(fetchKeywords());
      if (!fetchKeywords.fulfilled.match(resultKeywords))
        throw new Error(state.keywords.error);
    }
  
    if (editAccessStatus !== EditAccessStatus.Readonly && state.sources.list.length === 0) {
      const resultSources = await store.dispatch(fetchSources());
      if (!fetchSources.fulfilled.match(resultSources))
        throw new Error(state.sources.error);
    }
  }
  
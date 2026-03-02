import store from "../../../shared/services/store";
//import { fetchKeywords } from "../../keyword/store/KeywordListSlice";
import { fetchSources } from "../../source";
import { EditAccessStatus, getEditAccess } from "../../../shared/utils/utils";
import { IdeaDetail } from "../types/IdeaTypes";

export async function ideaAdditionalLoad(idea: IdeaDetail | null) {
    const state = store.getState();
    const currentUser = state.auth.currentUser;
  
    const editAccessStatus = idea ?
      getEditAccess(String(idea.id), currentUser, idea) :
      EditAccessStatus.Editable;
  
    if ([EditAccessStatus.Editable, EditAccessStatus.EditableAndPublishable, EditAccessStatus.EditableAndModeratable].includes(editAccessStatus)
       /*|| state.keywordList.list.length === 0*/) {// всегда тянем ключевые слова
      /*const resultKeywords = await store.dispatch(fetchKeywords());
      if (!fetchKeywords.fulfilled.match(resultKeywords))
        throw new Error(state.keywordList.error);*/
    }
  
    if ([EditAccessStatus.Editable, EditAccessStatus.EditableAndPublishable, EditAccessStatus.EditableAndModeratable].includes(editAccessStatus)
       || state.sourceList.list.length === 0) {
      const resultSources = await store.dispatch(fetchSources());
      if (!fetchSources.fulfilled.match(resultSources))
        throw new Error(state.sourceList.error);
    }
  }
  
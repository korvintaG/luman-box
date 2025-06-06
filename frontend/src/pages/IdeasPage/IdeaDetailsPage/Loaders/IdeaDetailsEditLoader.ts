import { Params } from "react-router-dom";
import store from "../../../../shared/services/store";
import { getIdea, getIdeaBySrcKw } from "../../../../features/ideas/store/IdeaSlice";
import { ideaAdditionalLoad } from "./IdeaDetailsAdditionalLoader";


export async function ideaEditLoad({ params, request }:
  { params: Params<"id">, request: Request }) {
  const { id } = params;
  const url = new URL(request.url);
  const condSrc = url.searchParams.get("source_id");
  const condKw = url.searchParams.get("keyword_id");
  const state = store.getState();

  if (id) {
    const result = await store.dispatch(getIdea(Number(id)));
    if (!getIdea.fulfilled.match(result))
      throw new Error(state.ideas.error);
    await ideaAdditionalLoad(state.ideas.current!);
    return null;

  }
  else if (condSrc && condKw) {
    const result = await store.dispatch(
      getIdeaBySrcKw({
        source_id: Number(condSrc),
        keyword_id: Number(condKw),
      }))
    if (!getIdeaBySrcKw.fulfilled.match(result))
      throw new Error(state.ideas.error);
    await ideaAdditionalLoad(state.ideas.current!);
    return null;
  }
  else
    throw new Error('Нет ни параметра ID запроса, ни query-параметров запроса!');
}
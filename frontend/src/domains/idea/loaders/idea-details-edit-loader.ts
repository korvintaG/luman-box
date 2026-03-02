import { Params } from "react-router-dom";
import store from "../../../shared/services/store";
import { getIdea, getIdeaBySrcKw } from "../store/idea-details-slice";
import { ideaAdditionalLoad } from "./idea-details-additional-loader";
import { fetchIdeaTypes } from "../store/idea-types-slice";
import { RequestStatus } from "../../../shared/types/types-for-hooks";


export async function ideaEditLoad({ params, request }:
  { params: Params<"id">, request: Request }) {
  const { id } = params;
  const url = new URL(request.url);
  const condSrc = url.searchParams.get("source_id");
  const condKw = url.searchParams.get("keyword_id");
  await store.dispatch(fetchIdeaTypes());
  const state = store.getState();
  if (
    state.ideaTypes.status === RequestStatus.Failed ||
    state.ideaTypes.status === RequestStatus.FailedUnAuth
  ) {
    throw new Error(state.ideaTypes.error);
  }

  if (id) {
    const result = await store.dispatch(getIdea(Number(id)));
    if (!getIdea.fulfilled.match(result))
      throw new Error(state.ideaDetail.error);
    await ideaAdditionalLoad(state.ideaDetail.current!);
    return null;

  }
  else if (condSrc && condKw) {
    const result = await store.dispatch(
      getIdeaBySrcKw({
        source_id: Number(condSrc),
        keyword_id: Number(condKw),
      }))
    if (!getIdeaBySrcKw.fulfilled.match(result))
      throw new Error(state.ideaDetail.error);
    await ideaAdditionalLoad(state.ideaDetail.current!); 
    return null;
  }
  else
    throw new Error('Нет ни параметра ID запроса, ни query-параметров запроса!');
}
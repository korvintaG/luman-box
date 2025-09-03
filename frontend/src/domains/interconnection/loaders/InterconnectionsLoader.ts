import { Params } from "react-router-dom";
import store from "../../../shared/services/store";
import { fetchInterconnections } from "../store/interconnection-list-slice";
import { InterconnectionsParamsType } from "../types/request-types";

export async function interconnectionsLoad({ params }: { params: Params<keyof InterconnectionsParamsType> }) {
  const { idea_id, iitype_id } = params;

  if (!idea_id || !iitype_id)
    throw new Error("Не заданы необходимые параметры страницы!");


  const result = await store.dispatch(fetchInterconnections({
    idea_id: idea_id,
    iitype_id: iitype_id,
  }));
  const state = store.getState();

  if (fetchInterconnections.fulfilled.match(result)) {
    return null;
  }

  throw new Error(state.interconnectionList.error);
}
import { Params } from "react-router-dom";
import store from "../../../../shared/services/store";
import { fetchInterconnections } from "../../../../features/interconnections/store/InterconnectionSlice";
import { InterconnectionsParamsType } from "../../../../features/interconnections/InterconnectionTypes";

export async function interconnectionsLoad({ params }: { params: Params<keyof InterconnectionsParamsType> }) {
  const { idea_id, iitype_id } = params;

  if (!idea_id || !iitype_id)
    throw new Error("Не заданы необходимые параметры страницы!");


  const result = await store.dispatch(fetchInterconnections({
    ideaID: Number(idea_id),
    interconnectionTypeID: Number(iitype_id),
  }));
  const state = store.getState();

  if (fetchInterconnections.fulfilled.match(result)) {
    return null;
  }

  throw new Error(state.interconnections.error);
}
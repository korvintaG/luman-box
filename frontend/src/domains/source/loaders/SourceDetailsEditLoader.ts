import { Params } from "react-router-dom";
import store from "../../../shared/services/store";
import { getSource } from "../store/SourceDetailsSlice";
import { sourceAdditionalLoad } from "./SourceDetailsAdditionalLoader";

export async function sourceEditLoad({ params }: { params: Params<"id"> }) {
  const { id } = params;
  if (id) {
    const result = await store.dispatch(getSource(Number(id)));
    const state = store.getState();

    if (!getSource.fulfilled.match(result)) {
      throw new Error(state.sourceDetails.error);
    }

    await sourceAdditionalLoad(state.sourceDetails.current ?? null);
    return null;
    
  }
  else
    throw new Error('Нет параметра ID запроса');
}
import { Params } from "react-router-dom";
import store from "../../../../shared/services/store";
import { getSource } from "../../../../features/sources/store/SourceSlice";
import { sourceAdditionalLoad } from "./SourceDetailsAdditionalLoader";



export async function sourceEditLoad({ params }: { params: Params<"id"> }) {
  const { id } = params;
  if (id) {
    const result = await store.dispatch(getSource(Number(id)));
    const state = store.getState();

    if (!getSource.fulfilled.match(result)) {
      throw new Error(state.sources.error);
    }

    await sourceAdditionalLoad(state.sources.current);
    return null;
    
  }
  else
    throw new Error('Нет параметра ID запроса');
}
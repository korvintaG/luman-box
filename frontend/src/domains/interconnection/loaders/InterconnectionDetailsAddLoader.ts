import { Params } from "react-router-dom";
import store from "../../../shared/services/store";
import { fetchCurrentIdea } from "../store/interconnection-add-slice";
import { InterconnectionsParamsType } from "../types/request-types";


export async function interconnectionAddLoad({ params }: { params: Params<keyof InterconnectionsParamsType> }) {
  const { idea_id, iitype_id } = params;

  if (!idea_id || !iitype_id)
    throw new Error("Не заданы необходимые параметры страницы!");

  const result = await store.dispatch(fetchCurrentIdea(Number(idea_id)));
  const state = store.getState();

  // Если запрос успешен, возвращаем null (или можно вернуть данные)
  if (fetchCurrentIdea.fulfilled.match(result)) {
    return null;
  }

  throw new Error(state.interconnectionAdd.error);

}
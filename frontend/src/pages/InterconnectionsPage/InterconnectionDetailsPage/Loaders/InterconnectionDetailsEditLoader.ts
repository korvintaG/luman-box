import { Params } from "react-router-dom";
import store from "../../../../shared/services/store";
import { fetchInterconnection } from "../../../../features/interconnections/store/InterconnectionSlice";



export async function interconnectionEditLoad({ params }: { params: Params<"id"> }) {
  let errorText = '';
  const { id } = params;
  if (id) {
    const result = await store.dispatch(fetchInterconnection(Number(id)));
    const state = store.getState();

    // Если запрос успешен, возвращаем null (или можно вернуть данные)
    if (fetchInterconnection.fulfilled.match(result)) {
      return null;
    }
    errorText = state.interconnections.error;

    throw new Error(errorText);
  }
  else
    throw new Error('Нет параметра ID запроса');
}
import { Params } from "react-router-dom";
import { getAuthor } from "../store/AuthorDetailsSlice";
import store from "../../../shared/services/store";
import { resetState } from "../../../features/files/store/filesSlice";



export async function authorLoad({ params }: { params: Params<"id"> }) {
  let errorText = '';
  const { id } = params;
  if (id) {
    store.dispatch(resetState());
    const result = await store.dispatch(getAuthor(Number(id)));
    const state = store.getState();

    // Если запрос успешен, возвращаем null (или можно вернуть данные)
    if (getAuthor.fulfilled.match(result)) {
      return null;
    }
    errorText = state.authorDetails.error;

    throw new Error(errorText);
  }
  else
    throw new Error('Нет параметра ID запроса');
}
import { Params } from "react-router-dom";
import store from "../../../../shared/services/store";
import { getKeyword } from "../../../../features/keywords/store/KeywordSlice";



export async function keywordLoad({ params }: { params: Params<"id"> }) {
  let errorText = '';
  const { id } = params;
  if (id) {
    const result = await store.dispatch(getKeyword(Number(id)));
    const state = store.getState();

    // Если запрос успешен, возвращаем null (или можно вернуть данные)
    if (getKeyword.fulfilled.match(result)) {
      return null;
    }
    errorText = state.keywords.error;

    throw new Error(errorText);
  }
  else
    throw new Error('Нет параметра ID запроса');
}
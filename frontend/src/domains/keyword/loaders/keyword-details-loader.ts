import { Params } from "react-router-dom";
import store from "../../../shared/services/store";
import { clearCurrentKeyword, getKeyword, setSliceStatus } from "../store/keyword-detail-slice";
import { RequestStatus } from "../../../shared/types/types-for-hooks";



export async function keywordLoad({ params }: { params: Params<"id"> }) {
  let errorText = '';
  const { id } = params;
  console.log('keywordLoad id=', id);
  if (id) {
    const result = await store.dispatch(getKeyword(Number(id)));
    console.log('keywordLoad result=', result);
    const state = store.getState();

    // Если запрос успешен, возвращаем null (или можно вернуть данные)
    if (getKeyword.fulfilled.match(result)) {
      console.log('keywordLoad getKeyword.fulfilled.match(result)');
      return null;
    }
    errorText = state.keywordDetail.error;

    throw new Error(errorText);
  }
  else
    throw new Error('Нет параметра ID запроса');
}
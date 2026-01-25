import { Params } from "react-router-dom";
import store from "../../../shared/services/store";
import { RequestStatus } from "../../../shared/types/types-for-hooks";
import { clearKeywordSummary, fetchKeywordSummary } from "../store/keyword-add-slice";



export async function keywordAddLoad({ params }: { params: Params<"class_keyword_id"> }) {
  let errorText = '';
  const { class_keyword_id } = params;
  if (class_keyword_id && class_keyword_id !== '0') {
    //console.log('keywordAddLoad class_keyword_id=', class_keyword_id);
    const result = await store.dispatch(fetchKeywordSummary(Number(class_keyword_id)));
    const state = store.getState();

    // Если запрос успешен, возвращаем null (или можно вернуть данные)
    if (fetchKeywordSummary.fulfilled.match(result)) {
      return null;
    }
    errorText = state.keywordDetail.error;

    throw new Error(errorText);
  }
  else {
    //console.log('keywordAddLoad else'); 
    // throw new Error('Нет параметра ID запроса');
    store.dispatch(clearKeywordSummary());
    return null;
  }
}
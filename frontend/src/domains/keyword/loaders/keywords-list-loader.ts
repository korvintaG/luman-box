import { fetchKeywords } from "../store/keyword-list-slice";
import store from "../../../shared/services/store";
import { Params } from "react-router-dom";

export async function keywordsLoad({ params }: { params: Params<"class_keyword_id"> }) {
  const { class_keyword_id } = params;
  const result = await store.dispatch(fetchKeywords(
    {class_id:String(class_keyword_id?class_keyword_id:'0')}));
  const state = store.getState();

  if (fetchKeywords.fulfilled.match(result)) {
    return null;
  }
  
  throw new Error(state.keywordList.error); 
}
import { useForm } from "../../../shared/hooks/useForm";
import { pick } from "lodash";
import { useDispatch, useSelector } from "../../../shared/services/store";
import {  IdeaAdd, IdeaDetail, IdeaDetailPartial, KeywordNameObject, UserAttitudeIdea } from "../types/IdeaTypes";
import { addIdea, approveIdea, attitudeIdea, delIdea, getIdea,  rejectIdea, 
  selectCurrentIdea, selectError, selectNewID, selectSliceState, setIdea, setSliceStatus, toModerateIdea } from "../store/idea-details-slice";
import {
  selectSources,
  selectError as selectSourcesError,
  selectSliceState as selectSourcesSliceState
} from "../../source";
import {
  selectKeywords,
  selectError as selectKeywordsError,
  selectSliceState as selectKeywordsSliceState
} from "../../keyword/store/keyword-list-slice";
import {
  searchKeywords,
  selectKeywords as selectSearchKeywords,
  selectError as selectSearchKeywordsError,
  selectSliceState as selectSearchKeywordsSliceState
} from "../../keyword/store/keyword-search-slice";
import { KeywordSummary, KeywordSearchResult } from "../../keyword/types/keyword-types";
import { SyntheticEvent, useEffect, useCallback, useRef } from "react";
import { getEditAccess } from "../../../shared/utils/utils";
import { DetailsHookProps, IDetailsEditHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";
import { IDObject } from "../../../shared/types/entity-types";
import { SourceShort } from "../../source/types/source-type";
import { useNavigate } from "react-router-dom";
import { genIdeaURL } from "../../../app/router/navigation";
import store from "../../../shared/services/store";

export interface DetailsIdeaHookProps extends  DetailsHookProps  {
  findSourceId: string | null;
  findKeywordId: string | null;
}

export interface DetailsIdeaHookRes<FormValues, Record> extends
  IDetailsEditHookRes<FormValues, Record> {
    record: IDetailsEditHookRes<FormValues, Record>['record'] & {
      sources: SourceShort[];
      keywords: KeywordSummary[];
    }
    form: IDetailsEditHookRes<FormValues, Record>['form'] & {
      searchKeyword: (token: string) => Promise<KeywordSearchResult[]>;
      setAttitude: (attitude: UserAttitudeIdea) => void;
      addKeyword: (item: KeywordNameObject) => void;
      deleteKeyword: (e: SyntheticEvent, id: number) => void;
    }
}


export const useIdeaDetails =({id, currentUser, findSourceId, findKeywordId}: 
  DetailsIdeaHookProps):DetailsIdeaHookRes<IdeaAdd, IdeaDetail>=>{
 
const { values, handleChange, setValues, getFormDTO, getFormDTOObl, editStarted, setEditStarted } = useForm<IdeaAdd>({
    name: "",
    source: { id: 0, name: "", author: {id:0, name:""}},
    original_text: "",
    content: "",
    date_time_create: new Date(),
    SVG:"",
    keyword_names: [],
    user: {id:0, name:"", role_id:0},
    moderation_notes: null,
    //attitudes: {all:{like:[0,0,0,0,0],importance:[0,0,0,0,0], truth:[0,0,0,0,0]}}
  });
  const sliceState = useSelector(selectSliceState);
  const sourcesSliceState = useSelector(selectSourcesSliceState);
  const keywordsSliceState = useSelector(selectKeywordsSliceState);
  const searchKeywordsSliceState = useSelector(selectSearchKeywordsSliceState);
  const currentRecord = useSelector(selectCurrentIdea);
  const sources = useSelector(selectSources);
  const errorText = useSelector(selectError);
  const sourcesErrorText = useSelector(selectSourcesError)
  const keywordsErrorText = useSelector(selectKeywordsError)
  const searchKeywordsError = useSelector(selectSearchKeywordsError)
  const searchKeywordsResults = useSelector(selectSearchKeywords)
  //const keywords = useSelector(selectKeywords);
  const newID = useSelector(selectNewID);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editAccessStatus = getEditAccess(id, currentUser, currentRecord)
  
  // Используем ref для хранения актуального значения keyword_names, чтобы не пересоздавать функцию searchKeyword
  const keywordNamesRef = useRef<number[]>([]);

  const fetchRecord = () => {
    if (id) {
      dispatch(getIdea(Number(id)))
      setEditStarted(false);
    }
    else if (newID) {
      navigate(genIdeaURL(newID)); //navigate to new author details page
      setEditStarted(false);
    }

  /*  if (id && Number(id) > 0) dispatch(getIdea(Number(id)));
    else if (findSourceId && findKeywordId)
      dispatch(
        getIdeaBySrcKw({
          source_id: Number(findSourceId),
          keyword_id: Number(findKeywordId),
        }),
      );
    else
        fetchAdditional();*/
  };

  /*const fetchAdditional= () =>{
      if (editAccessStatus!== EditAccessStatus.Readonly && sources.length === 0) 
        dispatch(fetchSources());
      if (keywords.length === 0) // всегда тянем ключевые слова
        dispatch(fetchKeywords());
  }*/

  const keywordsDTO = (): IDObject[] => {
    if (values.keyword_names)
      return values.keyword_names.map((el) => {
        return { id: el.id };
      });
    else return [];
  };

  useEffect(() => {
    if (currentRecord) {
      setValues({
        ...pick(currentRecord, [
          "SVG",
          "name",
          "original_text",
          "content",
          "date_time_create",
          "keyword_names",
          "user",
          "moderation_notes"
        ]),
        source: { 
          id: currentRecord.source ? Number(currentRecord.source.id) : 0, 
          name: currentRecord.source ? currentRecord.source.name : "", 
          author: {id:0, name:""}
          
        },
      });
      //fetchAdditional();
    }
  }, [currentRecord]);

  // Обновляем ref при изменении keyword_names
  useEffect(() => {
    keywordNamesRef.current = values.keyword_names?.map(kn => kn.id) || [];
  }, [values.keyword_names]);


  // Мемоизируем searchKeyword, чтобы избежать пересоздания функции при каждом рендере
  // Используем ref для получения актуального значения keyword_names
  const searchKeyword = useCallback(async (token: string): Promise<KeywordSearchResult[]> => {
    // Получаем список ID уже выбранных keyword_names для исключения из поиска из ref
    const keywordNamesExist = keywordNamesRef.current;
    // Диспатчим поиск с токеном и списком исключаемых ID
    // createAsyncThunk возвращает Promise, который можно await
    const result = await store.dispatch(searchKeywords({
      token,
      keyword_names_exist: keywordNamesExist.length > 0 ? keywordNamesExist : undefined
    }));
    
    // Проверяем, был ли запрос выполнен успешно
    if (searchKeywords.fulfilled.match(result)) {
      return result.payload;
    } else {
      // Если запрос был отклонен - выбрасываем ошибку с корректным текстом
      const errorMessage = result.error?.message || "Ошибка при поиске ключевых слов";
      throw new Error(errorMessage);
    }
  }, []); // Пустой массив зависимостей, так как используем ref

  const resetSlicesStatus = ()=>{
    dispatch(setSliceStatus(RequestStatus.Idle));
  }

  const deleteRecordAction = (e: SyntheticEvent) => {
    const idNumber = Number(id);
    dispatch(delIdea(idNumber));
  };

  const toModerateRecordAction = (e: SyntheticEvent) => {
    dispatch(toModerateIdea(Number(id)));
  };

  const approveRecordAction = (e: SyntheticEvent) => {
    const idNumber = Number(id);
    dispatch(approveIdea({id: idNumber, notes: values.moderation_notes || ""}));
  };

  const rejectRecordAction = (e: SyntheticEvent) => {
    const idNumber = Number(id);
    dispatch(rejectIdea({id: idNumber, notes: values.moderation_notes || ""}));
  };

  const deleteKeyword = (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    setEditStarted(true);
    setValues({
      ...values,
      keyword_names: values.keyword_names!.filter((el) => el.id !== id),
    });
  };

  const addKeyword = (item: KeywordNameObject) => {
    setEditStarted(true);
    setValues({ ...values, keyword_names: [...values.keyword_names!, item] });
  };

  const handleSubmitAction = (e: SyntheticEvent) => {
    console.log('handleSubmitAction')
    e.preventDefault();
    if (id) {
      const upd = {
        ...getFormDTO(),
        id: Number(id),
        keyword_names: values.keyword_names,
      };
      console.log('handleSubmitAction', upd)
      dispatch(
        setIdea(upd),
      );
    }
    else {
      const newIdea = { ...getFormDTOObl(), keyword_names: values.keyword_names };
      dispatch(addIdea(newIdea));
    }
  };

  const setAttitude = (attitude: UserAttitudeIdea) => {
    dispatch(attitudeIdea(attitude))
  }

  return {
    form: {
      values,
      handleChange,
      setValues,
      addKeyword,
      deleteKeyword,
      setAttitude,
      editStarted,
      setEditStarted,
      searchKeyword
    },
    record: {
      id: id?Number(id): undefined,
      newID,
      fetchRecord,
      currentRecord,
      deleteRecordAction, 
      handleSubmitAction,
      sources, 
      //keywords: keywords?keywords.keywords:[]      
      keywords: []      
    },
    status: {
      sliceStates:[sliceState, sourcesSliceState, keywordsSliceState, searchKeywordsSliceState],
      errorText: `${errorText} ${sourcesErrorText} ${keywordsErrorText} ${searchKeywordsError}`, 
      editAccessStatus,
      resetSlicesStatus
    },
    moderate:{
       approveRecordAction, rejectRecordAction, toModerateRecordAction
    }
}


  
} 
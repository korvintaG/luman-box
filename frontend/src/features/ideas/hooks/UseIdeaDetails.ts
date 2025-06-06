import { useForm } from "../../../shared/hooks/useForm";
import { pick } from "lodash";
import { useDispatch, useSelector } from "../../../shared/services/store";
import { User } from "../../auth/user-types";
import { Idea, IdeaInner, IdeaRaw, UserAttitudeIdea } from "../IdeaTypes";
import { addIdea, approveIdea, attitudeIdea, delIdea, getIdea, getIdeaBySrcKw, rejectIdea, selectCurrentIdea, selectError, selectIsDataLoading, selectSliceState, setIdea } from "../store/IdeaSlice";
import {
  selectSources,
  fetchSources,
  selectError as selectSourcesError,
  selectSliceState as selectSourcesSliceState
} from "../../../features/sources/store/SourceSlice";
import {
  selectKeywords,
  fetchKeywords,
  selectError as selectKeywordsError,
  selectSliceState as selectKeywordsSliceState
} from "../../../features/keywords/store/KeywordSlice";
import { Keyword, KeywordPartial } from "../../keywords/KeywordTypes";
import { SyntheticEvent, useEffect } from "react";
import { EditAccessStatus, getEditAccess } from "../../../shared/utils/utils";
import { DetailsHookProps, IDetailsEditHookRes } from "../../../shared/common-types";
import { Source } from "../../sources/SourceTypes";


export interface DetailsIdeaHookProps extends  DetailsHookProps  {
  findSourceId: string | null;
  findKeywordId: string | null;
}

export interface DetailsIdeaHookRes<FormValues, Record> extends
  IDetailsEditHookRes<FormValues, Record> {
    record: IDetailsEditHookRes<FormValues, Record>['record'] & {
      sources: Source[];
      keywords: Keyword[];
    }
    form: IDetailsEditHookRes<FormValues, Record>['form'] & {
      setAttitude : (attitude: UserAttitudeIdea) => void;
      addKeyword: (id: number) => void;
      deleteKeyword: (e: SyntheticEvent, id: number) => void;
    }
}


export const useIdeaDetails =({id, currentUser, findSourceId, findKeywordId}: 
  DetailsIdeaHookProps):DetailsIdeaHookRes<IdeaInner, Idea>=>{
 
const { values, handleChange, setValues, getFormDTO } = useForm<IdeaInner>({
    name: "",
    source: { id: 0 },
    original_text: "",
    content: "",
    date_time_create: "",
    SVG:"",
    keywords: [],
    attitudes: {all:{like:[0,0,0,0,0],importance:[0,0,0,0,0], truth:[0,0,0,0,0]}}
  });
  const sliceState = useSelector(selectSliceState);
  const sourcesSliceState = useSelector(selectSourcesSliceState);
  const keywordsSliceState = useSelector(selectKeywordsSliceState);
  const currentRecord = useSelector(selectCurrentIdea);
  const sources = useSelector(selectSources);
  const errorText = useSelector(selectError);
  const sourcesErrorText = useSelector(selectSourcesError)
  const keywordsErrorText = useSelector(selectKeywordsError)
  const keywords = useSelector(selectKeywords);
  const dispatch = useDispatch();
  const editAccessStatus = getEditAccess(id, currentUser, currentRecord)

  const fetchRecord = () => {
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

  const keywordsDTO = (): KeywordPartial[] => {
    if (values.keywords)
      return values.keywords.map((el) => {
        return { id: el.id };
      });
    else return [];
  };

 /* useEffect(() => {
    fetchRecord();
  }, []);*/

  useEffect(() => {
    if (currentRecord) {
      setValues({
        ...pick(currentRecord, [
          "SVG",
          "name",
          "original_text",
          "content",
          "date_time_create",
          "keywords",
        ]),
        source: { id: currentRecord.source ? Number(currentRecord.source.id) : 0 },
      });
      //fetchAdditional();
    }
  }, [currentRecord]);

  const deleteRecordAction = (e: SyntheticEvent) => {
    const idNumber = Number(id);
    dispatch(delIdea(idNumber));
  };

  const approveRecordAction = (e: SyntheticEvent) => {
    const idNumber = Number(id);
    dispatch(approveIdea(idNumber));
  };

  const rejectRecordAction = (e: SyntheticEvent) => {
    const idNumber = Number(id);
    dispatch(rejectIdea(idNumber));
  };

  const deleteKeyword = (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    setValues({
      ...values,
      keywords: values.keywords!.filter((el) => el.id !== id),
    });
  };

  const addKeyword = (id: number) => {
    setValues({ ...values, keywords: [...values.keywords!, { id }] });
  };

  const handleSubmitAction = (e: SyntheticEvent) => {
    e.preventDefault();
    if (id) {
      const upd={
        ...getFormDTO(),
        id: Number(id),
        keywords: keywordsDTO(),
      };
      //console.log('handleSubmitAction', upd)
      dispatch(
        setIdea(upd),
      );
    }
    else dispatch(addIdea({ ...getFormDTO(), keywords: keywordsDTO() }));
  };

  const setAttitude = (attitude: UserAttitudeIdea) => {
    dispatch(attitudeIdea(attitude))
  }

  return {
    form: {
      values,
      handleChange,
      addKeyword,
      deleteKeyword,
      setAttitude
    },
    record: {
      fetchRecord,
      currentRecord,
      deleteRecordAction, 
      handleSubmitAction,
      sources, 
      keywords      
    },
    status: {
      sliceStates:[sliceState, sourcesSliceState, keywordsSliceState],
      errorText: `${errorText} ${sourcesErrorText} ${keywordsErrorText}`, 
      editAccessStatus
    }, 
    moderate:{
       approveRecordAction, rejectRecordAction 
    }
}


  
} 
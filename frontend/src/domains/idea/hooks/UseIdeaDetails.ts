import { useForm } from "../../../shared/hooks/useForm";
import { pick } from "lodash";
import { useDispatch, useSelector } from "../../../shared/services/store";
import {  IdeaAdd, IdeaDetail, UserAttitudeIdea } from "../types/IdeaTypes";
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
} from "../../keyword/store/KeywordListSlice";
import { KeywordShort } from "../../keyword/types/KeywordTypes";
import { SyntheticEvent, useEffect } from "react";
import { getEditAccess } from "../../../shared/utils/utils";
import { DetailsHookProps, IDetailsEditHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";
import { IDObject } from "../../../shared/types/entity-types";
import { SourceShort } from "../../source/types/source-type";
import { useNavigate } from "react-router-dom";
import { genIdeaURL } from "../../../app/router/navigation";


export interface DetailsIdeaHookProps extends  DetailsHookProps  {
  findSourceId: string | null;
  findKeywordId: string | null;
}

export interface DetailsIdeaHookRes<FormValues, Record> extends
  IDetailsEditHookRes<FormValues, Record> {
    record: IDetailsEditHookRes<FormValues, Record>['record'] & {
      sources: SourceShort[];
      keywords: KeywordShort[];
    }
    form: IDetailsEditHookRes<FormValues, Record>['form'] & {
      setAttitude : (attitude: UserAttitudeIdea) => void;
      addKeyword: (id: number) => void;
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
    keywords: [],
    user: {id:0, name:"", role_id:0},
    moderation_notes: null,
    //attitudes: {all:{like:[0,0,0,0,0],importance:[0,0,0,0,0], truth:[0,0,0,0,0]}}
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
  const newID = useSelector(selectNewID);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editAccessStatus = getEditAccess(id, currentUser, currentRecord)

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
    if (values.keywords)
      return values.keywords.map((el) => {
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
          "keywords",
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
    else dispatch(addIdea({ ...getFormDTOObl(), keywords: keywordsDTO() }));
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
      setEditStarted
    },
    record: {
      id: id?Number(id): undefined,
      newID,
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
      editAccessStatus,
      resetSlicesStatus
    }, 
    moderate:{
       approveRecordAction, rejectRecordAction, toModerateRecordAction
    }
}


  
} 
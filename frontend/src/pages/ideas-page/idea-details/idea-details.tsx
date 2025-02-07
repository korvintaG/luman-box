import { useParams } from "react-router";
import { useMemo, useEffect, SyntheticEvent, useState } from "react";
import { IdeaDetailsUIFC } from "../../../components/ui/details/idea-details/idea-details";
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from "../../../services/store";
import {
  setIdea,
  selectCurrentIdea, 
  delIdea,
  selectError,
  selectIsDataLoading,
  getIdea,
  setStateSuccess,
  addIdea,
  resetStatus,
  getIdeaBySrcKw,
  selectSliceState,
} from "../../../slices/ideas";
import {
  selectSources,
  fetchSources, 
  selectIsDataLoading as sourcesLoading,
} from "../../../slices/sources";
import {
  selectKeywords,
  fetchKeywords,
  selectIsDataLoading as keywordsLoading,
} from "../../../slices/keywords";
import { appRoutes } from "../../../AppRoutes";
import {withFormStatus} from '../../../components/hocs/with-form-status'
import { omit }  from "lodash";
import { allowEdit, getUserCreator } from '../../../utils/utils';
import { KeywordPartial, IdeaRaw } from "../../../utils/type";
import { useForm } from "../../../hooks/useForm";
import { selectCurrentUser } from '../../../slices/auth/index';

export const IdeaDetails = () => {
  const { id } = useParams();
  const { values, handleChange, setValues, getFormDTO } = useForm<IdeaRaw>({
    name: "", 
    source: { id: 0 },
    original_text: "",
    content: "",
    date_time_create: "",
    keywords: [],
  });
  const [searchParams] = useSearchParams();
  const findSourceId = searchParams.get('source_id');
  const findKeywordId = searchParams.get('keyword_id');

  const isLoading = useSelector(selectIsDataLoading);
  const sliceState = useSelector(selectSliceState);
  const isSourcesLoading = useSelector(sourcesLoading);
  const currentIdea = useSelector(selectCurrentIdea);
  const currentUser = useSelector(selectCurrentUser);
  const sources = useSelector(selectSources);
  const errorText = useSelector(selectError);
  const isKeywordsLoading = useSelector(keywordsLoading);
  const keywords = useSelector(selectKeywords);
  const dispatch = useDispatch();

  const fetchIdea = () => {
    if (id && Number(id)>0) 
      dispatch(getIdea(Number(id)));
    else if (findSourceId && findKeywordId)
      dispatch(getIdeaBySrcKw({source_id:Number(findSourceId), keyword_id:Number(findKeywordId)}));
  };

  const resetSliceState =()=> dispatch(setStateSuccess());

  const keywordsDTO= (): KeywordPartial[] => {
    if (values.keywords)
      return values.keywords.map(el=>{return {id:el.id}})
    else
      return []
  }

  useEffect(() => {
    if (sources.length === 0) dispatch(fetchSources());
    if (keywords.length === 0) dispatch(fetchKeywords());
    fetchIdea();
    /*if (!id && findKeywordId && findSourceId)
      dispatch(getIdeaBySrcKw({source_id: Number(findSourceId), keyword_id: Number(findKeywordId)}))*/
  }, [id]);



  useEffect(() => {
    if (currentIdea) 
        setValues({
          ...omit(currentIdea,'user'),
          source: { id: currentIdea.source? Number(currentIdea.source.id) :0}
        })
  }, [currentIdea]);

  const deleteIdea = (e: SyntheticEvent) => {
    const idNumber = Number(id);
    dispatch(delIdea(idNumber));
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

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (id) 
      dispatch(
        setIdea({
          ...getFormDTO(),
          id: Number(id),
          keywords: keywordsDTO()}
      ));
    else 
      dispatch(addIdea({...getFormDTO(), keywords: keywordsDTO()}));
  };

  const initialName=currentIdea ? currentIdea.name : '';
  const IdeaForm = useMemo(()=>withFormStatus(IdeaDetailsUIFC),[setValues]);

  const realId=id ? id : (currentIdea?String(currentIdea.id):undefined);

  return ( 
    <IdeaForm
        listPath={appRoutes.ideas}
        id={realId?Number(realId):null} 
        fetchRecord={fetchIdea}
        isLoading={isLoading || isSourcesLoading || isKeywordsLoading}
        sliceState={sliceState}
        error={errorText}
        readOnly={!allowEdit(realId,currentUser,currentIdea)}
        values={values}
        initialName={initialName}
        handleChange={handleChange}
        handleSubmit={handleSubmit} 
        deleteQuestion={`Удалить идею [${initialName}]?`}
        deleteRecord={deleteIdea}
        resetSliceState={resetSliceState}
        sources={sources}
        keywords={keywords}
        addKeyword={addKeyword}
        deleteKeyword={deleteKeyword}
        userName={getUserCreator(currentIdea, currentUser)}
        />
  )
};

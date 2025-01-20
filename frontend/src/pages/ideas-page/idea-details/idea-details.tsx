import { useParams } from "react-router";
import { useEffect, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { IdeaDetailsUI } from "../../../components/ui/details/idea-details/idea-details";
import { useSelector, useDispatch } from "../../../services/store";
import { useMsgModal } from "../../../hooks/useMsgModal";
import {
  setIdea,
  selectCurrentIdea,
  delIdea,
  selectError,
  selectIsDataLoading,
  getIdea,
  setStateSuccess,
  addIdea,
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

import { KeywordPartial, IdeaRaw, isDMLRequestOK } from "../../../utils/type";
import { useForm } from "../../../hooks/useForm";
import { EditFormStatus } from "../../../components/ui/uni/edit-form-status/edit-form-status";
import { selectCurrentUser } from '../../../slices/auth/index';

export const IdeaDetails = () => {
  const msgDeleteHook = useMsgModal();
  const { id } = useParams();
  const { values, handleChange, setValues, getFormDTO } = useForm<IdeaRaw>({
    name: "", 
    source: { id: 0 },
    original_text: "",
    content: "",
    date_time_create: "",
    keywords: [],
  });

  const navigate = useNavigate();
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
    if (id) {
      const idNumber = Number(id);
      dispatch(getIdea(idNumber));
    }
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
  }, [id]);

  useEffect(() => {
    if (isDMLRequestOK(sliceState)) navigate(appRoutes.ideas);
  }, [sliceState]);

  useEffect(() => {
    if (currentIdea) 
        setValues({
          ...currentIdea,
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
    if (id) {
      const idNumber = Number(id);
      dispatch(
        setIdea({
          ...getFormDTO(),
          id: idNumber,
          keywords: keywordsDTO()}
      ));
    } else dispatch(addIdea({...getFormDTO(), keywords: keywordsDTO()}));
  };

  return (
    <EditFormStatus
      sliceState={sliceState}        
      isLoading={isLoading || isSourcesLoading || isKeywordsLoading}
      error={errorText}
      fetchRecord={fetchIdea}
      resetSliceState={resetSliceState}
      isDeleteDialog={msgDeleteHook.dialogWasOpened}
      authPath={appRoutes.auth}
      deleteDialogProps={{
        question: `Удалить идею [${values.name}]?`,
        action: deleteIdea,
        closeAction: msgDeleteHook.closeDialog,
      }}
    > 
      <IdeaDetailsUI
        id={id ? Number(id) : null}
        readOnly={!currentUser}
        values={values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        deleteIdea={msgDeleteHook.openDialog}
        sources={sources}
        keywords={keywords}
        addKeyword={addKeyword}
        deleteKeyword={deleteKeyword}
        initialName={currentIdea ? currentIdea.name : ""}
      />
    </EditFormStatus>
  );
};

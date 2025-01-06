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
  addIdea,
  selectSliceState,
} from "../../../slices/ideas";
import {
  selectSources,
  fetchSources, setStateSuccess,
  selectIsDataLoading as sourcesLoading,
} from "../../../slices/sources";
import {
  selectKeywords,
  fetchKeywords,
  selectIsDataLoading as keywordsLoading,
} from "../../../slices/keywords";
import { appRoutes } from "../../../AppRoutes";

import { RequestStatus, IdeaRaw, isDMLRequestOK } from "../../../utils/type";
import { useForm } from "../../../hooks/useForm";
import { EditFormStatus } from "../../../components/ui/uni/edit-form-status/edit-form-status";

export const IdeaDetails = () => {
  const msgDeleteHook = useMsgModal();
  const { id } = useParams();
  const { values, handleChange, setValues } = useForm<IdeaRaw>({
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
        source: { id: Number(currentIdea.source.id) },
      });
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
          ...values,
          id: idNumber,
          source: { id: Number(values.source.id) },
        })
      );
    } else dispatch(addIdea(values));
  };

  return (
    <EditFormStatus
      sliceState={sliceState}        
      isLoading={isLoading || isSourcesLoading || isKeywordsLoading}
      error={errorText}
      fetchRecord={fetchIdea}
      resetSliceState={resetSliceState}
      isDeleteDialog={msgDeleteHook.dialogWasOpened}
      deleteDialogProps={{
        question: `Удалить идею [${values.name}]?`,
        action: deleteIdea,
        closeAction: msgDeleteHook.closeDialog,
      }}
    > 
      <IdeaDetailsUI
        id={id ? Number(id) : null}
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

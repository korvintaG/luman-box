import { useMemo, useEffect, SyntheticEvent } from "react";
import { useParams } from "react-router";
import { AuthorDetailsUIFC } from "../../../components/ui/details/author-details/author-details";
import { useSelector, useDispatch } from "../../../services/store";
import {
  setAuthor,
  selectCurrentAuthor,
  delAuthor,
  selectError,
  setStateSuccess,
  approveAuthor,
  getAuthor,
  addAuthor,
  selectSliceState,
  rejectAuthor,
} from "../../../slices/authors";
import { selectCurrentUser } from "../../../slices/auth/index";
import { appRoutes } from "../../../AppRoutes";
import { AuthorInner, RequestStatus } from "../../../utils/type";
import { useForm } from "../../../hooks/useForm";
import {
  getEditAccess,
  getUserCreator,
  getModerator,
} from "../../../utils/utils";
import { pick } from "lodash";
import { withFormStatus } from "../../../components/hocs/with-form-status";

export const AuthorDetails = () => {
  const { id } = useParams();
  const { values, handleChange, setValues, getFormDTO } = useForm<AuthorInner>({
    name: "",
  });

  const dispatch = useDispatch();
  const sliceState = useSelector(selectSliceState);
  const errorText = useSelector(selectError);
  const currentUser = useSelector(selectCurrentUser);
  const currentAuthor = useSelector(selectCurrentAuthor);

  function fetchAuthor() {
    if (id) dispatch(getAuthor(Number(id)));
  }

  const resetSliceState = () => dispatch(setStateSuccess());

  useEffect(() => fetchAuthor(), []);

  useEffect(() => {
    if (currentAuthor) setValues({ ...pick(currentAuthor, ["name","sources","ideas","keywords"]) });
  }, [currentAuthor, setValues]);

  const deleteAuthor = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(delAuthor(Number(id)));
  };

  const approveAuthorAction = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(approveAuthor(Number(id)));
  };

  const rejectAuthorAction = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(rejectAuthor(Number(id)));
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (id) {
      console.log("AuthorDetails handleSubmit id", id);
      const newo = { ...getFormDTO(), id: Number(id) };
      console.log("AuthorDetails handleSubmit", newo);
      dispatch(setAuthor(newo));
    } else dispatch(addAuthor({ ...getFormDTO() }));
  };

  const initialName = currentAuthor ? currentAuthor.name : "";
  const AuthorForm = useMemo(
    () => withFormStatus(AuthorDetailsUIFC),
    [setValues],
  );

  return (
    <AuthorForm
      listPath={appRoutes.authors}
      id={id ? Number(id) : null}
      fetchRecord={fetchAuthor}
      isLoading={sliceState === RequestStatus.Loading}
      sliceState={sliceState}
      error={errorText}
      editAccessStatus={getEditAccess(id, currentUser, currentAuthor)}
      values={values}
      initialName={initialName}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      deleteQuestion={`Удалить автора [${initialName}]?`}
      deleteRecord={deleteAuthor}
      approveRecord={approveAuthorAction}
      rejectRecord={rejectAuthorAction}
      resetSliceState={resetSliceState}
      userName={getUserCreator(currentAuthor, currentUser)}
      moderatorName={getModerator(currentAuthor)}
    />
  );
};

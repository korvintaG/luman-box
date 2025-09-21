import { useEffect, SyntheticEvent } from "react";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { pick } from "lodash";
import {
  setSource,
  selectCurrentSource,
  delSource,
  selectError,
  approveSource,
  rejectSource,
  getSource,
  addSource,
  selectSliceState,
  setSliceStatus,
  toModerateSource,
  selectNewID,
} from "../store/SourceDetailsSlice";
import { useForm } from "../../../shared/hooks/useForm";
import {
  getEditAccess
} from "../../../shared/utils/utils";
import { SourceDetail, SourceAdd } from "../types/source-type";
import {
  selectAuthors, 
  selectError as selectAuthorError,
  selectSliceState as selectAuthorsSliceState,
  AuthorShort
} from "../../../domains/author/";
import { DetailsHookProps, IDetailsWithPhotoHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";
import {
  selectCurrentFile, selectSliceState as selectFileSliceState,
  selectError as fileSelectError,
  setSliceStatus as setFileSliceStatus,
  uploadFile
} from "../../../features/files/store/filesSlice";
import { calcUpdateImage } from "../../../features/files/utils";


export interface DetailsSourceHookRes<FormValues, Record> extends
  IDetailsWithPhotoHookRes<FormValues, Record> {
  authors: AuthorShort[];
}

export const useSourceDetails = ({ id, currentUser }: DetailsHookProps)
  : DetailsSourceHookRes<SourceAdd, SourceDetail> => {
  const { values, handleChange, setValues, getFormDTO, getFormDTOObl, editStarted, setEditStarted } = useForm<SourceAdd>({
    name: "",
    author: { id: 0, name: "" },
    publication_year: '',
    about_source: '',
    image_URL: '',
    moderation_notes: ''
  });

  const sliceState = useSelector(selectSliceState);
  const fileSliceState = useSelector(selectFileSliceState);
  const currentFile = useSelector(selectCurrentFile);
  const fileErrorText = useSelector(fileSelectError);
  const newID = useSelector(selectNewID);

  const errorText = useSelector(selectError);
  const authorsSliceState = useSelector(selectAuthorsSliceState);
  const authorErrorText = useSelector(selectAuthorError);
  const currentRecord = useSelector(selectCurrentSource);
  const authors = useSelector(selectAuthors)
  const dispatch = useDispatch();
  const editAccessStatus = getEditAccess(id, currentUser, currentRecord)

  const fetchRecord = () => {
    if (id)
      dispatch(getSource(Number(id)))
  };

  useEffect(() => {
    if (currentRecord) {
      setValues({
        ...pick(currentRecord, ["name", "author", "publication_year", "about_source", "image_URL", "moderation_notes"]),
        author: { id: currentRecord.author ? currentRecord.author.id : 0, name: "" },
      });
      //fetchAdditional();      
    }
  }, [currentRecord]);

  useEffect(() => {
    if (currentFile) {
      setValues({ ...values, new_image_URL: currentFile })
    }
  }, [currentFile])

  const deleteRecordAction = (e: SyntheticEvent) => {
    dispatch(delSource(Number(id)));
  };

  const toModerateRecordAction = (e: SyntheticEvent) => {
    dispatch(toModerateSource(Number(id)));
  };

  const approveRecordAction = (e: SyntheticEvent) => {
    dispatch(approveSource({ id: Number(id), notes: values.moderation_notes || "" }));
  };

  const rejectRecordAction = (e: SyntheticEvent) => {
    dispatch(rejectSource({ id: Number(id), notes: values.moderation_notes || "" }));
  };

  const handleSubmitAction = (e: SyntheticEvent) => {
    e.preventDefault();
    let newImageURL = calcUpdateImage(values.image_URL, values.new_image_URL);
    if (id) dispatch(setSource({ ...getFormDTO(), id: Number(id), image_URL: newImageURL }));
    else dispatch(addSource({ ...getFormDTOObl(), image_URL: newImageURL ?? null }));
  };

  const uploadFileAction = (data: FormData) => {
    setEditStarted(true);
    dispatch(uploadFile(data));
  }

  const resetSlicesStatus = () => {
    dispatch(setSliceStatus(RequestStatus.Idle));
    dispatch(setFileSliceStatus(RequestStatus.Idle));
  }

  return {
    form: {
      values,
      handleChange,
      setValues,
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
      uploadFileAction
    },
    status: {
      sliceStates: [sliceState, fileSliceState, authorsSliceState],
      errorText: `${errorText} ${fileErrorText} ${authorErrorText}`,
      editAccessStatus,
      resetSlicesStatus
    },
    moderate: {
      approveRecordAction, rejectRecordAction, toModerateRecordAction
    },
    authors
  }

};

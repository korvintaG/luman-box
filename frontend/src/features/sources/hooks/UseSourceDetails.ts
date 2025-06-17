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
} from "../store/SourceSlice";
import { useForm } from "../../../shared/hooks/useForm";
import {
  getEditAccess
} from "../../../shared/utils/utils";
import { Source, SourceInner } from "../SourceTypes";
import {
  selectAuthors,
  selectError as selectAuthorError,
  selectSliceState as selectAuthorsSliceState
} from "../../authors/store/AuthorSlice";
import { DetailsHookProps, IDetailsWithPhotoHookRes, RequestStatus } from "../../../shared/common-types";
import { Author } from "../../authors/AuthorTypes";
import {
  selectCurrentFile, selectSliceState as selectFileSliceState,
  selectError as fileSelectError,
  setSliceStatus as setFileSliceStatus,
  uploadFile
} from "../../files/store/filesSlice";
import { calcUpdateImage } from "../../files/utils";


export interface DetailsSourceHookRes<FormValues, Record> extends
  IDetailsWithPhotoHookRes<FormValues, Record> {
  authors: Author[];
}

export const useSourceDetails = ({ id, currentUser }: DetailsHookProps)
  : DetailsSourceHookRes<SourceInner, Source> => {
  const { values, handleChange, setValues, getFormDTO } = useForm<SourceInner>({
    name: "",
    author: { id: 0 },
    publication_year: '',
    about_source: '',
    image_URL: ''
  });

  const sliceState = useSelector(selectSliceState);
  const fileSliceState = useSelector(selectFileSliceState);
  const currentFile = useSelector(selectCurrentFile);
  const fileErrorText = useSelector(fileSelectError);

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
        ...pick(currentRecord, ["name", "author", "publication_year", "about_source", "image_URL"]),
        author: { id: currentRecord.author ? currentRecord.author.id : 0 },
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

  const approveRecordAction = (e: SyntheticEvent) => {
    dispatch(approveSource(Number(id)));
  };

  const rejectRecordAction = (e: SyntheticEvent) => {
    dispatch(rejectSource(Number(id)));
  };

  const handleSubmitAction = (e: SyntheticEvent) => {
    e.preventDefault();
    let newImageURL = calcUpdateImage(values.image_URL, values.new_image_URL);
    if (id) dispatch(setSource({ ...getFormDTO(), id: Number(id), image_URL: newImageURL }));
    else dispatch(addSource({ ...getFormDTO(), image_URL: newImageURL }));
  };

  const uploadFileAction = (data: FormData) => {
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
      setValues
    },
    record: {
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
      approveRecordAction, rejectRecordAction
    },
    authors
  }

};

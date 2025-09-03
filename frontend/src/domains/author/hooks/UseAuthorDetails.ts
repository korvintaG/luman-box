import { useEffect, SyntheticEvent } from "react";
import { pick } from "lodash";
import { useForm } from "../../../shared/hooks/useForm";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { AuthorAdd, AuthorDetail } from "../types/author-type";
import {
  setAuthor,
  selectCurrentAuthor,
  delAuthor,
  selectError,
  approveAuthor,
  getAuthor,
  addAuthor,
  selectSliceState,
  rejectAuthor,
  setSliceStatus,
  toModerateAuthor,
  selectNewID,
} from "../store/AuthorDetailsSlice";
import { selectCurrentFile, selectSliceState as selectFileSliceState, 
  selectError as fileSelectError,
  setSliceStatus as setFileSliceStatus,
  uploadFile } from "../../../features/files/store/filesSlice"; 
import {
  getEditAccess,
} from "../../../shared/utils/utils";
import { DetailsHookProps, IDetailsEditHookRes, IDetailsWithPhotoHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";
import { calcUpdateImage } from "../../../features/files/utils";
import { useNavigate } from "react-router-dom";
import { genAuthorURL } from "../../../app/router/navigation";


export const useAuthorDetails = ({ id, currentUser }: DetailsHookProps)
  : IDetailsWithPhotoHookRes<AuthorAdd, AuthorDetail> => {
  const { values, handleChange, setValues, getFormDTO, getFormDTOObl, editStarted, setEditStarted } = useForm<AuthorAdd>({
    name: "",
    birth_date: "",
    birth_place: "",
    about_author: "",
    image_URL: "",
    new_image_URL: "",
    moderation_notes: null
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sliceState = useSelector(selectSliceState);
  const fileSliceState = useSelector(selectFileSliceState);
  const currentFile = useSelector(selectCurrentFile);
  const errorText = useSelector(selectError);
  const fileErrorText=useSelector(fileSelectError);
  const currentRecord = useSelector(selectCurrentAuthor);
  const editAccessStatus = getEditAccess(id, currentUser, currentRecord)
  const newID = useSelector(selectNewID);

  function fetchRecord() {
    //console.log('useAuthorDetails fetchRecord id=', id, 'newID=', newID);
    if (id) {
      dispatch(getAuthor(Number(id)))
      setEditStarted(false);
    }
  }

  /*useEffect(() => fetchRecord(), []);*/

  useEffect(() => {
    if (currentRecord) {
      setValues({
        ...pick(currentRecord,
          ["name", "birth_date", "birth_place", "about_author", "image_URL", "moderation_notes"]),
        new_image_URL: undefined
      });
      //setCurrentFileName(currentRecord.image_URL);
    }
  }, [currentRecord, setValues]);

  useEffect(() => {
    if (currentFile) {
      setValues({ ...values, new_image_URL: currentFile })
    }
  }, [currentFile])

  const deleteRecordAction = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(delAuthor(Number(id)));
  };

  const toModerateRecordAction = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(toModerateAuthor(Number(id)));
  };

  const approveRecordAction = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(approveAuthor({id: Number(id), notes: values.moderation_notes || ""}));
  };

  const rejectRecordAction = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(rejectAuthor({id: Number(id), notes: values.moderation_notes || ""}));
  };

  const uploadFileAction = (data: FormData) => {
    setEditStarted(true);
    dispatch(uploadFile(data));
  }

  const resetSlicesStatus = ()=>{
    dispatch(setSliceStatus(RequestStatus.Idle));
    dispatch(setFileSliceStatus(RequestStatus.Idle));
  }

  const handleSubmitAction = (e: SyntheticEvent) => {
    //console.log('useAuthorDetails handleSubmit')
    e.preventDefault();
    let newImageURL=calcUpdateImage( values.image_URL, values.new_image_URL);
    if (id) {
      //console.log('useAuthorDetails handleSubmit id')
      const newo = { ...getFormDTO(), id: Number(id), image_URL: newImageURL };
      dispatch(setAuthor(newo));
    }
    else { 
      //console.log('useAuthorDetails handleSubmit not id',getFormDTO())
      dispatch(addAuthor({ ...getFormDTOObl(), image_URL: (newImageURL? newImageURL : null) }));
    }
  };

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
      sliceStates: [sliceState, fileSliceState],
      errorText: errorText + fileErrorText,
      editAccessStatus,
      resetSlicesStatus 
    },
    moderate: {
      approveRecordAction, rejectRecordAction, toModerateRecordAction
    }
  }

}
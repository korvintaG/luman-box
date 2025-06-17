import { useEffect, SyntheticEvent } from "react";
import { pick } from "lodash";
import { useForm } from "../../../shared/hooks/useForm";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { Author, AuthorInner } from "../AuthorTypes";
import { User } from "../../auth/user-types";
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
} from "../store/AuthorSlice";
import { selectCurrentFile, selectSliceState as selectFileSliceState, 
  selectError as fileSelectError,
  setSliceStatus as setFileSliceStatus,
  uploadFile } from "../../files/store/filesSlice";
import {
  getEditAccess,
} from "../../../shared/utils/utils";
import { DetailsHookProps, IDetailsEditHookRes, IDetailsWithPhotoHookRes, RequestStatus } from "../../../shared/common-types";
import { calcUpdateImage } from "../../files/utils";


export const useAuthorDetails = ({ id, currentUser }: DetailsHookProps)
  : IDetailsWithPhotoHookRes<AuthorInner, Author> => {
  const { values, handleChange, setValues, getFormDTO } = useForm<AuthorInner>({
    name: "",
    birth_date: "",
    birth_place: "",
    about_author: "",
    image_URL: "",
    new_image_URL: ""
  });

  const dispatch = useDispatch();
  const sliceState = useSelector(selectSliceState);
  const fileSliceState = useSelector(selectFileSliceState);
  const currentFile = useSelector(selectCurrentFile);
  const errorText = useSelector(selectError);
  const fileErrorText=useSelector(fileSelectError);
  const currentRecord = useSelector(selectCurrentAuthor);
  const editAccessStatus = getEditAccess(id, currentUser, currentRecord)

  function fetchRecord() {
    if (id) dispatch(getAuthor(Number(id)));
  }

  /*useEffect(() => fetchRecord(), []);*/

  useEffect(() => {
    if (currentRecord) {
      setValues({
        ...pick(currentRecord,
          ["name", "birth_date", "birth_place", "about_author", "image_URL"]),
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

  const approveRecordAction = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(approveAuthor(Number(id)));
  };

  const rejectRecordAction = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(rejectAuthor(Number(id)));
  };

  const uploadFileAction = (data: FormData) => {
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
      dispatch(addAuthor({ ...getFormDTO(), image_URL: newImageURL }));
    }
  };

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
      sliceStates: [sliceState, fileSliceState],
      errorText: errorText + fileErrorText,
      editAccessStatus,
      resetSlicesStatus 
    },
    moderate: {
      approveRecordAction, rejectRecordAction
    }
  }

}
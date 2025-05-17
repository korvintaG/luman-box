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
} from "../store/SourceSlice";
import { useForm } from "../../../shared/hooks/useForm"; 
import {
    EditAccessStatus,
  getEditAccess
} from "../../../shared/utils/utils";
import { Source, SourceInner } from "../SourceTypes";
import { fetchAuthors, selectAuthors, 
  selectError as selectAuthorError,
  selectSliceState as selectAuthorsSliceState } from "../../authors/store/AuthorSlice";
import { DetailsHookProps, IDetailsEditHookRes } from "../../../shared/common-types";
import { Author } from "../../authors/AuthorTypes";


export interface DetailsSourceHookRes<FormValues, Record> extends
  IDetailsEditHookRes<FormValues, Record> {
    authors: Author[];
}

export const useSourceDetails = ({id, currentUser}: DetailsHookProps)
  :  DetailsSourceHookRes<SourceInner, Source> => {
  const { values, handleChange, setValues, getFormDTO } = useForm<SourceInner>({
    name: "",
    author: { id: 0 }
  });

  const sliceState = useSelector(selectSliceState);
  const errorText = useSelector(selectError);
  const authorsSliceState = useSelector(selectAuthorsSliceState);
  const authorErrorText = useSelector(selectAuthorError);
  const currentRecord = useSelector(selectCurrentSource);
  const authors=useSelector(selectAuthors)
  const dispatch = useDispatch();
  const editAccessStatus = getEditAccess(id, currentUser, currentRecord)

  const fetchRecord = () => {
    if (id) 
      dispatch(getSource(Number(id)))
    else
      fetchAdditional();
  };

  const fetchAdditional = () => {
    if (editAccessStatus!== EditAccessStatus.Readonly && authors.length===0)
      dispatch(fetchAuthors());
  }

  useEffect(() => fetchRecord(), []);

  useEffect(() => {
    if (currentRecord) {
      setValues({
        ...pick(currentRecord, ["name","author"]),
        author: { id: currentRecord.author ? currentRecord.author.id : 0 },
      });
      fetchAdditional();      
    }
  }, [currentRecord]);

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
    if (id) dispatch(setSource({ ...getFormDTO(), id: Number(id) }));
    else dispatch(addSource({ ...getFormDTO() }));
  };

  return {
    form: {
      values,
      handleChange
    },
    record: {
      fetchRecord,
      currentRecord,
      deleteRecordAction, 
      handleSubmitAction
    },
    status: {
      sliceStates:[sliceState, authorsSliceState],
      errorText: `${errorText} ${authorErrorText}`, 
      editAccessStatus
    }, 
    moderate:{
       approveRecordAction, rejectRecordAction 
    },
    authors
  }

};

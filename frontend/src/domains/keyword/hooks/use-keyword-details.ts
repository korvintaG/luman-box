import { useEffect, SyntheticEvent, useMemo } from "react";
import { useSelector, useDispatch } from "../../../shared/services/store";
import {
  setKeyword,
  selectCurrentKeyword,
  delKeyword,
  selectError,
  approveKeyword,
  rejectKeyword,
  getKeyword,
  selectSliceState,
  toModerateKeyword,
  setSliceStatus,
  selectNewID,
} from "../store/keyword-detail-slice";
import { useForm } from "../../../shared/hooks/useForm"; 
import { omit, pick } from "lodash";
import {
  EditAccessStatus,
  getEditAccess
  
} from "../../../shared/utils/utils";
import { KeywordDetail, KeywordEdit, KeywordNameEdit, KeywordsDetailsHookProps } from "../types/keyword-types";
import { IDetailsEditHookRes, RequestStatus } from "../../../shared/types/types-for-hooks";
import { VerificationStatus } from "../../../shared/types/entity-types";
import { Role, User } from "../../../features/auth/user-types";


const getEditAccessStatus=(id: string | undefined, 
  currentUser: User | null, 
  currentRecordPre: KeywordDetail | null | undefined,
  currentRecord: KeywordDetail | null | undefined,
  keywordsModerationId: number | undefined):EditAccessStatus => {
    let editAccessStatus = getEditAccess(id, currentUser, currentRecordPre, true)
    if (editAccessStatus===EditAccessStatus.PossibleInsert)
      if (currentRecord) {
        const inModeration=currentRecord.names.filter(el=>el.verification_status===VerificationStatus.ToModerate)
        if (inModeration.length>0)
          editAccessStatus=EditAccessStatus.Readonly
      }
    if (editAccessStatus===EditAccessStatus.Readonly 
        && currentUser 
        && [Role.Admin, Role.SuperAdmin].includes(currentUser.role_id)
        && keywordsModerationId
        && currentRecord && currentRecord.moderations && currentRecord.moderations.length>0
    )
    {
      const currentModeration=currentRecord.moderations.filter(el=>el.id===keywordsModerationId)
      if (currentModeration.length>0)
        editAccessStatus=EditAccessStatus.EditableAndModeratableInserted;
    }
    //console.log('useKeywordDetails editAccessStatus=',editAccessStatus)
    return editAccessStatus;
}

const getNamesReadonly = (el: KeywordNameEdit, currentUser: User | null,
  editAccessStatus:EditAccessStatus,
  keywordsModerationId: number | undefined
):boolean=>{
  let readOnly: boolean = false;
  if (el.name) {
    if ([EditAccessStatus.Readonly, EditAccessStatus.EditableAndModeratableInserted].includes(editAccessStatus)
        || !currentUser) {
      //console.log('useKeywordDetails el.name=',el.name,el,keywordsModerationId)
      if (currentUser 
        && [Role.Admin, Role.SuperAdmin].includes(currentUser.role_id)
        && el.verification_status===VerificationStatus.ToModerate
        && el.keyword_moderation_id===keywordsModerationId
      )
        readOnly=false;
      else
        readOnly=true;
    }
    else if (editAccessStatus===EditAccessStatus.PossibleInsert && 
         el.user_id===currentUser.id &&
         el.verification_status!==VerificationStatus.Creating
        )
        readOnly=true;
  }
  //console.log('useEffect currentRecord editAccessStatus=',editAccessStatus,'readOnly',readOnly)
  return readOnly;

}

export const useKeywordDetails = ({id, currentUser, keywordsModerationId}: KeywordsDetailsHookProps)
  : IDetailsEditHookRes<KeywordEdit, KeywordDetail> => {
  const { values, handleChange, setValues, getFormDTO, getFormDTOObl, 
    editStarted, setEditStarted, setFieldValueDirect } = useForm<KeywordEdit>({
    id: 0,
    name: "",
    definition:"",
    class_keyword_id: 0,
    default_name_index: 0,
    names: []
  });

  const dispatch = useDispatch();
  const sliceState = useSelector(selectSliceState);
  const errorText = useSelector(selectError);
  const currentRecordPre = useSelector(selectCurrentKeyword);
  const newID = useSelector(selectNewID);
  const currentRecord=useMemo(() => currentRecordPre ? 
    {...currentRecordPre, names: [...currentRecordPre.names, {name:''}]}
    :currentRecordPre, [currentRecordPre]);

    const editAccessStatus = getEditAccessStatus(id, currentUser, currentRecordPre,
      currentRecord, keywordsModerationId) 

    const fetchRecord = () => {
      if (id) 
        dispatch(getKeyword(Number(id)));
    };


  /*useEffect(() => fetchRecord(), []);*/

  useEffect(() => {
    if (currentRecord) {
      console.log('useEffect currentRecord=',currentRecord)
      setValues({
        ...pick(currentRecord, ["id", "name", "definition", "class_keyword_id", "default_name_index"]),
        names: currentRecord.names?.map((el) => {
          const readOnly=getNamesReadonly(el, currentUser, editAccessStatus,keywordsModerationId);
          return { 
            id: el.id, 
            name: el.name ?? "", 
            readOnly, 
            verification_status: el.verification_status,
            keyword_moderation_id: el.keyword_moderation_id,
            moderation_notes: el.moderation_notes  };
        }) ?? [],
        moderation_notes: currentRecord.moderation_notes ?? ""
      });
      setEditStarted(false) // чтобы сбросить начало редактирования
    }
  }, [currentRecord, currentUser]);

  const deleteRecordAction = (e: SyntheticEvent) => {
    dispatch(delKeyword(Number(id)));
  };

  const resetSlicesStatus = ()=>{
    dispatch(setSliceStatus(RequestStatus.Idle));
  }

  const toModerateRecordAction = (e: SyntheticEvent) => {
    dispatch(toModerateKeyword(Number(id)));
  };

  const approveRecordAction = (e: SyntheticEvent) => {
    dispatch(approveKeyword({
      id: Number(id), 
      notes: values.moderation_notes || "", 
      moderationRecordID: keywordsModerationId
    }));
  };

  const rejectRecordAction = (e: SyntheticEvent) => {
    dispatch(rejectKeyword({
      id: Number(id), 
      notes: values.moderation_notes || "",
      moderationRecordID: keywordsModerationId
    }));
  };

  const handleSubmitAction = (e: SyntheticEvent) => {
    //console.log('useKeywordDetails','handleSubmitAction id=',id)
    e.preventDefault();
    if (id) {
      const dto=omit(getFormDTO(),['name']);
      console.log('handleSubmitAction dto=',dto)
      const newo = { ...dto, 
        id: Number(id), 
        names: dto.names?.filter(el=>el.name!=="")
      };
      //console.log('useKeywordDetails','handleSubmitAction newo=',newo)
      dispatch(setKeyword(newo));
    }
    //else dispatch(addKeyword({ ...getFormDTOObl() }));
  };

  return {
    form: {
      values,
      handleChange,
      setValues,
      editStarted,
      setEditStarted,
      setFieldValueDirect
    },
    record: {
      id: id?Number(id): undefined,
      newID,
      fetchRecord,
      currentRecord,
      deleteRecordAction, 
      handleSubmitAction
    },
    status: {
      sliceStates:[sliceState],
      errorText, 
      editAccessStatus,
      resetSlicesStatus
    }, 
    moderate:{
       approveRecordAction, rejectRecordAction, toModerateRecordAction
    }
  }

}

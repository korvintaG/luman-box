import { IDObject, 
  ModerationNotes, 
  NameObject, 
  ObjectCreation, 
  ObjectCreationPlain, 
  ObjectModeration, 
  ObjectModerationPlain, 
  SimpleNameObject, 
  SimpleObjectToAdd, 
  SimpleObjectToAddWithVerify, 
  VerificationStatus } from "../../../shared/types/entity-types";
import { UserPartial } from "../../../features/auth/user-types";
import { DetailsHookProps } from "../../../shared/types/types-for-hooks";
import { KeywordNameObject } from "../../idea/types/IdeaTypes";

// для списка
export type KeywordListItem = SimpleNameObject & {
  verification_status: VerificationStatus,
  names_to_moderate?: number
};

// для краткого
export type KeywordSummary = SimpleNameObject & {
   bread_crumbs?: string,
   class_name_before?: string;
}

// общее для добавления новой и редактирования старой
export type KeywordGeneral = {
  definition: string;
  class_keyword_id: number;
  default_name_index?: number;
}

// для добавления
export type KeywordAdd = NameObject & KeywordGeneral & {
  names: string[];
} 

export type KeywordNameEdit = SimpleObjectToAddWithVerify & {
  keyword_moderation_id?: number | null;
  moderation_notes?: string;
};

// для редактирования 
export type KeywordEdit = SimpleNameObject & KeywordGeneral & {
  names: KeywordNameEdit[]
  moderation_notes?: string;
}

// всякие рассчетные дополнения для детального вида
export type KeywordDetailAttachments = {
  class_name_before?: string;
  class_name_after?: string;
  bread_crumbs?: string;
  sources?: SimpleNameObject[];
  authors?: SimpleNameObject[];
  ideas?: SimpleNameObject[];
};

// тип для доступа по классам
export type KeywordList = {
  current: {
    id: number;
    definition?:string;
    verification_status?:number;
    name?:string;
    bread_crumbs?:string;
    names_to_moderate?:number;
  }
  keywords: KeywordListItem[];
}

export type KeywordModeration = IDObject & {
  date_time_create: Date,
  user: SimpleNameObject
}

export type KeywordDetail = KeywordEdit &  
  KeywordDetailAttachments & ObjectCreation & ObjectModeration & {
    moderations?:KeywordModeration[]
  };


export type KeywordDetailPartial = Partial<KeywordDetail> & IDObject; // ID есть всегда

export type KeywordListParam = {class_id?: string} // параметр для списка ключевых слов

export interface KeywordsDetailsHookProps extends DetailsHookProps {
  keywordsModerationId?: number
}

export type KeywordSearchToken = {
  token: string;
  keyword_names_exist?:number[];
}

export type KeywordSearchResult= KeywordNameObject
/*SimpleNameObject & {
  class_name_before?: string;
}*/
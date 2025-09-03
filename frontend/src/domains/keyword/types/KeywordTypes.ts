import { IDObject, ModerationNotes, NameObject, ObjectCreation, ObjectCreationPlain, ObjectModeration, ObjectModerationPlain, SimpleNameObject, VerificationStatus } from "../../../shared/types/entity-types";
import { UserPartial } from "../../../features/auth/user-types";

// общее для списка и деталей
export type KeywordListDetailGeneral = { 
}

// для списка
export type KeywordShort = SimpleNameObject & KeywordListDetailGeneral;

export type KeywordList=KeywordShort & { // для списка
  verification_status: VerificationStatus;
};

// для добавления
export type KeywordAdd = NameObject & KeywordListDetailGeneral & ModerationNotes & {
  definition: string;
} ;

// Keyword линейный
export type KeywordPlain =  KeywordAdd & IDObject & ObjectCreationPlain & ObjectModerationPlain;

// всякие рассчетные дополнения для детального вида
export type KeywordDetailAttachments = {
  sources?: SimpleNameObject[];
  authors?: SimpleNameObject[];
  ideas?: SimpleNameObject[];
};

export type KeywordDetail = KeywordAdd & IDObject & KeywordDetailAttachments & ObjectCreation & ObjectModeration;


export type KeywordDetailPartial = Partial<KeywordDetail>;


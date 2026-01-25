import { IDObject, ModerationNotes, NameObject, ObjectCreation, ObjectCreationPlain, ObjectModeration, ObjectModerationPlain, SimpleNameObject, SimpleNameObjectWithCnt, SimpleObjectToSet, VerificationStatus } from "../../../shared/types/entity-types";

// общее для списка и деталей
export type SourceListDetailGeneral = {
  author: SimpleNameObject;
}

// короткое представление для разных мест
export type SourceShort = SimpleNameObject & SourceListDetailGeneral;

export type SourceList=SourceShort & { // для списка
  verification_status: VerificationStatus;
}

// Источники
export type SourceAdd = NameObject & SourceListDetailGeneral & ModerationNotes & {
  publication_year: string;
  about_source: string;
  image_URL: string | null;
  new_image_URL?: string | null;
};

export type SourcePlain = Omit<SourceAdd, 'new_image_URL'> & IDObject & ObjectCreationPlain & ObjectModerationPlain;

export type SourceDetailAttachments = {
  ideas?: SimpleNameObject[];
  keywords?: SimpleNameObjectWithCnt[];
};

export type SourceDetail = SourceAdd & IDObject & SourceDetailAttachments & ObjectCreation & ObjectModeration;
export type SourceDetailPartial = Partial<SourceDetail> & IDObject;


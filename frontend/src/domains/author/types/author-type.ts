import { IDObject, ModerationNotes, NameObject, ObjectCreation, ObjectCreationPlain, ObjectModeration, ObjectModerationPlain, SimpleNameObject, VerificationStatus } from "../../../shared/types/entity-types";
import { UserPartial } from "../../../features/auth/user-types";

// общее для списка и деталей
export type AuthorListDetailGeneral = { 
  birth_date: string;
}

// для списка
export type AuthorShort = SimpleNameObject & AuthorListDetailGeneral;

export type AuthorList=AuthorShort & { // для списка
  verification_status: VerificationStatus;
};

// для добавления
export type AuthorAdd = NameObject & AuthorListDetailGeneral & ModerationNotes & {
  birth_place: string;
  about_author: string;
  image_URL: string | null ;
  new_image_URL?: string | null | undefined;
};

// Author линейный
export type AuthorPlain =  Omit<AuthorAdd, 'new_image_URL'> & IDObject & ObjectCreationPlain & ObjectModerationPlain;

// всякие рассчетные дополнения для детального вида
export type AuthorDetailAttachments = {
  sources?: SimpleNameObject[];
  ideas?: SimpleNameObject[];   
  keywords?: SimpleNameObject[];  
};

export type AuthorDetail = AuthorAdd & IDObject & AuthorDetailAttachments & ObjectCreation & ObjectModeration;
export type AuthorDetailPartial = Partial<AuthorDetail> & IDObject;

/*export type AuthorRaw = AuthorAdd & {
  sources?: SimpleNameObject[];
  ideas?: SimpleNameObject[];   
  keywords?: SimpleNameObject[];  
};
export type AuthorRawPartial = Partial<AuthorRaw>;
export type AuthorPartial = Partial<Author> & IDObject; // то же что автор, но обязательный ID
export type Author = AuthorRaw &
  IDObject & {
    moderated?: number;
  };
*/

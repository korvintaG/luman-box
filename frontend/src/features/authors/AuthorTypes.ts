import { IDObject, NameObject, SimpleNameObject } from "../../shared/common-types";
import { UserPartial } from "../auth/user-types";

// Авторы
export type AuthorInner = NameObject & {
  birth_date: string;
  birth_place: string;
  about_author: string;
  image_URL: string | null;
  new_image_URL?: string | null;
};

export type AuthorRaw = AuthorInner & {
  user?: UserPartial;
  moderator?: UserPartial;
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


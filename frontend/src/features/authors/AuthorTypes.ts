import { IDObject, NameObject, SimpleNameObject } from "../../shared/common-types";
import { UserPartial } from "../auth/user-types";

// Авторы
export type AuthorInner = NameObject;
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


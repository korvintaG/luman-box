import { AuthorPartial } from "../authors/AuthorTypes";
import { IDObject, NameObject, SimpleNameObject, SimpleNameObjectWithCnt } from "../../shared/common-types";
import { UserPartial } from "../auth/user-types";

// Источники
export type SourceInner = NameObject & {
  author?: AuthorPartial;
};
export type SourceRaw = SourceInner & {
  user?: UserPartial;
  moderator?: UserPartial;
  ideas?: SimpleNameObject[];
  keywords?: SimpleNameObjectWithCnt[];
};
export type SourceRawPartial = Partial<SourceRaw>;
export type SourcePartial = Partial<Source> & IDObject;
export type Source = SourceRaw &
  IDObject & {
    moderated?: number;
  };

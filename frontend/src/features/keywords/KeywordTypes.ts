import { IDObject, NameObject, SimpleNameObject } from "../../shared/common-types";
import { UserPartial } from "../auth/user-types";

// ключевые слова
export type KeywordInner = NameObject;
export type KeywordRaw = KeywordInner & {
  user?: UserPartial;
  moderator?: UserPartial;
  sources?: SimpleNameObject[];
  authors?: SimpleNameObject[];
  ideas?: SimpleNameObject[];
};
export type KeywordRawPartial = Partial<KeywordRaw>;
export type Keyword = KeywordRaw &
  IDObject & {
    moderated?: number;
  };
export type KeywordPartial = Partial<Keyword> & IDObject;

import { IDObject, NameObject } from "../../shared/common-types";
import { InterconnectionsCount } from "../interconnections/InterconnectionTypes"; 
import { KeywordPartial } from "../keywords/KeywordTypes";
import { SourcePartial } from "../sources/SourceTypes";
import { UserPartial } from "../auth/user-types";

// Идеи
export type IdeaInner = NameObject & {
    original_text: string;
    content: string;
    date_time_create: string;
    source: SourcePartial;
    keywords: KeywordPartial[];
    attitudes?:IdeaAttitudes;
    interconnections?: InterconnectionsCount[];
    SVG: string | null;
  };
  
  
  export type IdeaRaw = IdeaInner & {
    user?: UserPartial;
    moderator?: UserPartial;
  };
  
  export type IdeaRawPartial = Partial<IdeaRaw>;
  export type IdeaPartial = Partial<Idea> & IDObject;
  
  export type IdeaForList = {
    id: number;
    name:string;
    source_name: string;
    source_id:number;
  }
  
  export type UserAttitude={
    like: number;
    importance: number;
    truth: number;  
  }
  
  export type UserAttitudeIdea = Partial<UserAttitude> & IDObject;
  
  export type IdeaAttitudes={
    all:{
      like:number[];
      importance:number[];
      truth:number[];
    }
    user?:UserAttitude;
  }
  
  export type Idea = IdeaRaw &
    IDObject & {
      moderated?: number;
    };
  
  
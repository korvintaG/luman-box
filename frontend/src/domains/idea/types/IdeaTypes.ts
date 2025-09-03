import { IDObject, ModerationNotes, NameObject, ObjectCreation, ObjectCreationPlain, ObjectModeration, ObjectModerationPlain, SimpleNameObject, VerificationStatus } from "../../../shared/types/entity-types";
import { User, UserPartial } from "../../../features/auth/user-types";
import { InterconnectionsCount } from "../../interconnection/types/query-types"; 
import { SourceShort } from "../../source/types/source-type";

// общее для списка и деталей
export type IdeaListDetailGeneral = {
  SVG: string | null;
  date_time_create: Date;
  user: User;
  source: SourceShort;
}

export type IdeaShort = SimpleNameObject & IdeaListDetailGeneral;

export type IdeaListPlain = SimpleNameObject & {
  source_id: number;
  source_name: string;
  SVG: string | null;
}

export type IdeaList=IdeaShort & { // для списка
  verification_status: VerificationStatus;
};

export type IdeaAdd = NameObject & IdeaListDetailGeneral &  ModerationNotes & {
  original_text: string;
  content: string;
  keywords: IDObject[];
}

export type IdeaPlain = IdeaAdd & IDObject & ObjectCreationPlain & ObjectModerationPlain;

export type IdeaDetailAttachments = {
  attitudes?:IdeaAttitudes;
  interconnections?: InterconnectionsCount[];
}

export type IdeaDetail = IdeaAdd & IDObject & IdeaDetailAttachments & ObjectCreation & ObjectModeration;
export type IdeaDetailPartial = Partial<IdeaDetail>;

  
  export type IdeaForList = {
    id: number;
    name:string;
    source_name: string;
    source_id:number;
    SVG: string | null;
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
  
  
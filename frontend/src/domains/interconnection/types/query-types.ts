// параметризация разных запросов
import { VerificationStatus } from "../../../shared/types/entity-types";
import { IdeaListPlain } from "../../idea/types/IdeaTypes"


export type InterconnectionsCount = {
    id: number;
    name:string;
    cnt1:number;
    cnt2:number;
  }

 
// служебный тип - идея в списке связей
export type InterconnectionIdea = IdeaListPlain & {
  interconnection_name: string;
  interconnection_id: number;
  verification_status: VerificationStatus;
}

// тип списка связей к идее
export type InterconnectionList = {
  idea: IdeaListPlain;
  interconnections_direct: InterconnectionIdea[];
  interconnections_reverse: InterconnectionIdea[];
}


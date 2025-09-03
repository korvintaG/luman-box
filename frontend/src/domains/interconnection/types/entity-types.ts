import { IDObject, ModerationNotes, ObjectCreation, ObjectModeration, VerificationStatus } from "../../../shared/types/entity-types";
import { IdeaListPlain } from "../../idea/types/IdeaTypes";


// типы связей
export enum InterconnectionTypes {
    Details=3, // связь "детали"
    SolvesProblem=5 // связь "решает проблему"
}

// промежуточный тип - названия связи туда и обратно
export type InterconnectionNames = {
    name_direct: string;
    name_reverse: string;
}

export type InterconnectionAdd = InterconnectionNames & ModerationNotes & {
    interconnection_type: number,
    idea1_id: number,
    idea2_id: number,
}

export type InterconnectionDetailAttachments = {
    idea_current: IdeaListPlain | null,
    idea_interconnect: IdeaListPlain | null,
}

export type InterconnectionDetail = IDObject & 
    InterconnectionAdd & 
    ObjectCreation & 
    ObjectModeration & 
    InterconnectionDetailAttachments;   
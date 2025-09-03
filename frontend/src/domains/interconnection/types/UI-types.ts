import { ModerationNotes } from "../../../shared/types/entity-types";
import { InterconnectionNames } from "./entity-types";

// для добавления связи - редактируемые поля 
export type InterconnectionAddForm = InterconnectionNames & {
    idea_id: number | null;
}  

// для обновления связи - редактируемые поля 
export type InterconnectionUpdateForm = InterconnectionNames & ModerationNotes & {
    id: number;
}

// позиция счетчика связей
export enum InterconnestionPosition {
    topLeftBottomCenter = 'topLeftBottomCenter',
    leftCenterRightCenter = 'leftCenterRightCenter',
    topLeftBottomRight = 'topLeftBottomRight'
}

export type InterconnectionTypeInfo = {
    id: number;
    hintFromIdea: string;
    countPosition: InterconnestionPosition;
    name: string;
    name1_many: string;
    name1_one: string;
    name2_many: string;
    name2_one: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    //isIconCntReverce: boolean;
}

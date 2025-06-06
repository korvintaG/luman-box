import { User } from "../auth/user-types";
import { IdeaForList } from "../ideas/IdeaTypes"; 

export type InterconnectionsParamsType = {
  idea_id: string,
  iitype_id: string
}


export type InterconnectionsCount = {
    id: number;
    name:string;
    cnt1:number;
    cnt2:number;
  }
  
  export enum InterconnectionTypes {
    Details=3,
    SolvesProblem=5
  }
  

  export type IdeaInterconnectionsPar = {
    ideaID: number;
    interconnectionTypeID:number;
  }
  
  export type IdeaInterconnectionByIdeaIDPar = {
    ideaCurrentID: number;
    ideaToInterconnectID: number;
    interconnectionTypeID:number;
  }
  
  
  export type InterconnectionIdeas = {
    idea_id: number;
    name:string;
    source_name: string;
    source_id:number;
    interconnection_name: string;
    interconnection_id: number;
    SVG?: string;
  }
  
  export type IdeaInterconnections = {
    idea: {
      id: number;
      name:string;
      source_name: string;
      source_id:number;
      SVG: string | undefined;
    }
    interconnections_direct: InterconnectionIdeas[];
    interconnections_reverse: InterconnectionIdeas[];
  }
  
  export type InterconnectionEditForm = {
    //interconnectionTypeID: number | undefined;
    nameDirect: string;
    nameReverse: string;
    //currentIdea: IdeaForList;
    //interconnectionIdea: IdeaForList;
  }

  export type InterconnectionAddForm = {
    nameDirect: string;
    nameReverse: string;
    ideaID: string | null;
  }  
  
  export type InterconnectionAddData = {
    ideaCurrent:IdeaForList | null,
    ideaInterconnect:IdeaForList | null
  }

  export type InterconnectionEditData = InterconnectionAddData & {
      id: number,
      interconnection_type: number,
      idea1_id: number,
      idea2_id: number,
      user_id: number,
      name_direct: string,
      name_reverse: string,
      date_time_create: string | null,
      moderated: number | null,
      date_time_moderated: string | null  ,
      user?: User,
      moderator?: User
  }
  
  export type InterconnectionCreateDTO = {
    idea1_id: number, 
    interconnection_type: number, 
    idea2_id: number,
    name_direct : string,
    name_reverse : string,
  }
  
  export type InterconnectionUpdateDTO = {
    id: number, 
    name_direct : string
    name_reverse : string
  }
  
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
  
  
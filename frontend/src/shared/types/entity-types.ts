import { User } from "../../features/auth/user-types";

// универсальные типы
export type IDObject = {
    id: number;
  };
  
  export type NameObject = {
    name: string;
  };
  
  export type SimpleNameObject = IDObject & NameObject;

  export type SimpleObjectToAdd = Partial<IDObject> & NameObject;
    
  export type SimpleObjectToSet = IDObject & Partial<NameObject>;
  
  export type SimpleNameObjectWithCnt = IDObject & NameObject & { cnt: number };

  export type ObjectCreationPlain = {
    date_time_create: Date;
    user_id: number;
  };

  export type ObjectCreation = ObjectCreationPlain  & {
    user: User;
  };

  export enum VerificationStatus {
    Creating = 0,
    ToModerate = 1,
    Moderated = 3,
    Rejected = 2,
    //PossibleInsert = 4
  } 

  export type SimpleObjectToAddWithVerify = SimpleObjectToAdd & {
    user_id?:number;
    verification_status?:VerificationStatus
  };

  export type SimpleObjectToAddWithRO = SimpleObjectToAdd & {
    readOnly?:boolean;
    verification_status?:VerificationStatus;
    moderation_notes?:string;
  };


  export const VerificationStatusLabels: Record<VerificationStatus, string> = {
    [VerificationStatus.Creating]: 'Создание',
    [VerificationStatus.ToModerate]: 'На модерации',
    [VerificationStatus.Moderated]: 'Одобрено',
    [VerificationStatus.Rejected]: 'Отклонено'
  };

  export const VerificationStatusClass: Record<VerificationStatus, string> = {
    [VerificationStatus.Creating]: 'creating',
    [VerificationStatus.ToModerate]: 'to-moderate',
    [VerificationStatus.Moderated]: 'moderated',
    [VerificationStatus.Rejected]: 'rejected'
  };
  
  export type ModerationNotes = {
    moderation_notes: string | null;
  };
  
  export type ObjectModerationPlain = {
    verification_status: VerificationStatus;
    date_time_to_moderate: Date;
    date_time_moderated: Date;
    verified_user_id: number;
    moderation_notes: string | null;
  };

  export type ObjectModeration = ObjectModerationPlain  & {
    moderator: User;
  };

export type ObjectCreationWithModeration = Partial<ObjectCreation> & Partial<ObjectModeration>;

  export type DeleteEntityResponse = {
    success: boolean;
    message: string;
    id: number;
  };

  export enum ModerationStatus {
    Approve = 'approve',
    Reject = 'reject',
  }

  export type ModerateEntityResponse = {
    success: boolean;
    message: string;
    id: number;
    moderationStatus: ModerationStatus;
  };

  export interface IModerate {
    id: number;
    notes: string;
    moderationRecordID?:number;
  }
  
import { SimpleNameObject, VerificationStatus } from "../../../types/entity-types";

export interface IAuthorshipRecord  {
  date_time_create: Date | null;
  user: SimpleNameObject | null;
  verification_status: VerificationStatus | null;
  date_time_to_moderate: Date | null;
  moderator: SimpleNameObject | null;
  date_time_moderated: Date | null;
  moderation_notes: string | null;
}

export interface IAuthorshipProps <T extends IAuthorshipRecord>{
    record: T;
    entityName?:string;
    className?: string;
  };
  
import { VerificationStatus } from "../types/entity-types";

export function getVerificationClass(verification_status: VerificationStatus) {
    switch (verification_status) {
        case VerificationStatus.Creating:
            return "record-draft";
        case VerificationStatus.ToModerate:
            return "record-to-moderate";
        case VerificationStatus.Moderated:
            return "record-moderated";
        case VerificationStatus.Rejected:
            return "record-canceled";
    }
    return "record-draft";
}
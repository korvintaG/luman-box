import { CMS, CMSPath } from "../CMSTypes";
import { BasicInstructionsCMS } from "../components/BasicInstructions/BasicInstructions";
import { CommunicationLevelCMS } from "../components/CommunicationLevel/CommunicationLevel";
import { CompetingInterpretationsCMS } from "../components/CompetingInterpretations/CompetingInterpretations";
import { IdeasNetCMS } from "../components/IdeasNet/IdeasNet";
import { LikeMindedPeopleCMS } from "../components/LikeMindedPeople/LikeMindedPeople";
import { MortimerAdlerCMS } from "../components/MortimerAdler/MortimerAdler";
import { NotBanCMS } from "../components/NotBan/NotBan";
import { PremoderationCMS } from "../components/Premoderation/Premoderation";
import { TelegramAuthorizationCMS } from "../components/TelegramAuthorization/TelegramAuthorization";
import { WikipediaDictatorshipCMS } from "../components/WikipediaDictatorship/WikipediaDictatorship";
import { ZettelKastenCMS } from "../components/ZettelKasten/ZettelKasten";



export const CMSData: CMS[] = [
    {
        name: CMSPath.IdeasNet,
        element: IdeasNetCMS
    },
    {
        name: CMSPath.ZettelKasten,
        element: ZettelKastenCMS
    },
    {
        name: CMSPath.MortimerAdler,
        element: MortimerAdlerCMS
    },
    {
        name: CMSPath.BasicInstructions,
        element: BasicInstructionsCMS
    },
    {
        name: CMSPath.CommunicationLevel,
        element: CommunicationLevelCMS
    },
    {
        name: CMSPath.CompetingInterpretations,
        element: CompetingInterpretationsCMS
    },
    {
        name: CMSPath.LikeMindedPeople,
        element: LikeMindedPeopleCMS
    },
    {
        name: CMSPath.Premoderation,
        element: PremoderationCMS
    },
    {
        name: CMSPath.TelegramAuthorization,
        element: TelegramAuthorizationCMS
    },
    {
        name: CMSPath.WikipediaDictatorship,
        element: WikipediaDictatorshipCMS
    },
    {
        name: CMSPath.NotBan,
        element: NotBanCMS
    },
]


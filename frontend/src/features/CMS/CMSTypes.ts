import { BasicInstructionsCMS } from "./components/BasicInstructions/BasicInstructions";
import { CommunicationLevelCMS } from "./components/CommunicationLevel/CommunicationLevel";
import { CompetingInterpretationsCMS } from "./components/CompetingInterpretations/CompetingInterpretations";
import { LikeMindedPeopleCMS } from "./components/LikeMindedPeople/LikeMindedPeople";
import { MortimerAdlerCMS } from "./components/MortimerAdler/MortimerAdler";
import { PremoderationCMS } from "./components/Premoderation/Premoderation";
import { TelegramAuthorizationCMS } from "./components/TelegramAuthorization/TelegramAuthorization";
import { WikipediaDictatorshipCMS } from "./components/WikipediaDictatorship/WikipediaDictatorship";
import { ZettelKastenCMS } from "./components/Zettelkasten/Zettelkasten";

export type SimpleComponentType = () => JSX.Element;

export type CMS = {
    name: string;
    element: SimpleComponentType
}

export enum CMSPath {
    ZettelKasten='ZettelKasten',
    MortimerAdler='Mortimer_Adler',
    BasicInstructions='Basic_Instructions',
    CommunicationLevel='Communication_Level',
    CompetingInterpretations='Competing_Interpretations',
    LikeMindedPeople='Like-Minded_People',
    Premoderation='Premoderation',
    TelegramAuthorization='Telegram_Authorization',
    WikipediaDictatorship='Wikipedia_Dictatorship'
}

export const CMSData: CMS[] = [
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
]

export const genCMSPath= (article: CMSPath) : string =>{
    return `/CMS/${article}`
}
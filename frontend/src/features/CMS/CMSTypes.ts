import { FunctionComponent } from "react";

export type SimpleComponentType = () => JSX.Element;

export type AsPartOfProps =  {
    asPartOf?:boolean;
}


export type CMS = {
    name: string;
    element: SimpleComponentType | FunctionComponent<AsPartOfProps>
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
    WikipediaDictatorship='Wikipedia_Dictatorship',
    NotBan='Not_Ban',
    IdeasNet='Ideas_Net',
    AboutUs='About_Us'
}

export const genCMSPath= (article: CMSPath) : string =>{
    return `/CMS/${article}`
}
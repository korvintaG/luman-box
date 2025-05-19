import { MortimerAdlerCMS } from "./components/MortimerAdler/MortimerAdler";
import { ZettelKastenCMS } from "./components/zettelkasten/zettelkasten";

export type SimpleComponentType = () => JSX.Element;

export type CMS = {
    name: string;
    element: SimpleComponentType
}


export const CMSData: CMS[] = [
    {
        name: 'zettelkasten',
        element: ZettelKastenCMS
    },
    {
        name: 'Mortimer_Adler',
        element: MortimerAdlerCMS
    }    
]
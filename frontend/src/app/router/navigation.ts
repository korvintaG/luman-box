import { generatePath} from "react-router-dom"
import { appRoutes } from "./AppRoutes"

export const genIdeaURL=(id:number)=>generatePath (appRoutes.idea,{id})
export const genAuthorURL=(id:number)=>generatePath (appRoutes.author,{id})
export const genKeywordURL=(id:number)=>generatePath (appRoutes.keyword,{id})
export const genSourceURL=(sid:number)=>generatePath (appRoutes.source,{id:sid})

export const genInterconnectionURL=(icid:number, isReverse: boolean = false)=>{
    let URL=generatePath (appRoutes.ideaInterconnection,{id:icid});
    if (isReverse)
        URL+='?is_reverse=1';
    return URL;
}

export const genInterconnectionsURL=(idea_id:number, iitype_id: number)=>
    generatePath (appRoutes.ideaInterconnections,{idea_id, iitype_id})
export const genAuthorAddURL = appRoutes.authorAdd;
export const genKeywordAddURL = appRoutes.keywordAdd;
export const genSourceAddURL = appRoutes.sourceAdd;
export const genIdeaAddURL = appRoutes.ideaAdd;
export const genInterconnectionAddURL= (idea_id: number, iitype_id: number, isReverse: boolean) =>
    { 
        return generatePath (appRoutes.ideaInterconnectionAdd,{idea_id, iitype_id}) 
            + (isReverse? '?is_reverse=1' : '');
    }


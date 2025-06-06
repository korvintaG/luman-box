import { generatePath} from "react-router-dom"
import { appRoutesURL } from "./AppRoutesURL"

export const genIdeaURL=(id:number)=>generatePath (appRoutesURL.idea,{id})
export const genAuthorURL=(id:number)=>generatePath (appRoutesURL.author,{id})
export const genKeywordURL=(id:number)=>generatePath (appRoutesURL.keyword,{id})
export const genSourceURL=(sid:number)=>generatePath (appRoutesURL.source,{id:sid})

export const genInterconnectionURL=(icid:number, isReverse: boolean = false)=>{
    let URL=generatePath (appRoutesURL.interconnection,{id:icid});
    if (isReverse)
        URL+='?is_reverse=1';
    return URL;
}

export const genInterconnectionsURL=(idea_id:number, iitype_id: number)=>
    generatePath (appRoutesURL.interconnections,{idea_id, iitype_id})
export const genAuthorAddURL = appRoutesURL.authorAdd;
export const genKeywordAddURL = appRoutesURL.keywordAdd;
export const genSourceAddURL = appRoutesURL.sourceAdd;
export const genIdeaAddURL = appRoutesURL.ideaAdd;
export const genInterconnectionAddURL= (idea_id: number, iitype_id: number, isReverse: boolean) =>
    { 
        return generatePath (appRoutesURL.interconnectionAdd,{idea_id, iitype_id}) 
            + (isReverse? '?is_reverse=1' : '');
    }


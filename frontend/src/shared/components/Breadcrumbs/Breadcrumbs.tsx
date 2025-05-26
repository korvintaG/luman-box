import { FC } from "react";
import { appRoutes } from "../../../app/router/AppRoutes";
import { CMSPath, genCMSPath } from "../../../features/CMS/CMSTypes";
import styles from "./Breadcrumbs.module.css";

export const enum BreadcrumbSimpeType {
    CMSAbout= 'CMSAbout',
    CMSIdeasNet='CMSIdeasNet',
    LikeMindedPeople='LikeMindedPeople',
    AuthorsList='AuthorsList',
    SourcesList='SourcesList',
    IdeasList='IdeasList',
    KeywordsList='KeywordsList',
} 
  
export type BreadcrumbContent ={
    name: string;
    path: string;
}

export type Breadcrumb = BreadcrumbSimpeType | BreadcrumbContent;

export type BreadcrumbSimple = BreadcrumbContent &  {
    id: BreadcrumbSimpeType;
} 

export const BreadcrumbsData:BreadcrumbSimple[] =[
    {
        id:BreadcrumbSimpeType.CMSAbout,
        name:'О проекте',
        path:appRoutes.home
    },
    {
        id:BreadcrumbSimpeType.CMSIdeasNet,
        name:'Публичная сеть идей',
        path:genCMSPath(CMSPath.IdeasNet)
    },
    {
        id:BreadcrumbSimpeType.LikeMindedPeople,
        name:'Единомышленники',
        path: genCMSPath(CMSPath.LikeMindedPeople)
    },
    {
        id:BreadcrumbSimpeType.AuthorsList,
        name:'Список авторов',
        path: appRoutes.authors
    },
    {
        id:BreadcrumbSimpeType.SourcesList,
        name:'Список источников',
        path: appRoutes.sources
    },
    {
        id:BreadcrumbSimpeType.IdeasList,
        name:'Список идей',
        path: appRoutes.ideas
    },
    {
        id:BreadcrumbSimpeType.KeywordsList,
        name:'Список ключевых слов',
        path: appRoutes.keywords
    },

];
 
export type BreadcrumbsProps = {
    breadcrumbElementTypes: Breadcrumb[];
    header?:string;
}

export const Breadcrumbs:FC<BreadcrumbsProps>=({breadcrumbElementTypes : bets, header})=>{
    return <nav className={styles.nav}>
        {bets.map((bet,cnt)=>{
            let bd:BreadcrumbContent;
            if (typeof bet !=='object') {
                const found=BreadcrumbsData.find((el)=>bet===el.id);
                if (found) 
                    bd=found
                else
                    return null;
            }
            else 
                bd=bet;
            const BC=<a href={bd.path}>{bd.name}</a>;
            if (cnt!==bets.length-1 || header)
                return <>
                    {BC}
                    {'>'} 
                </>
            else
                return BC;
        })}
        {header && <h1>{header}</h1>}
    </nav>

}

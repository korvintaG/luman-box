import { FC } from "react";
import { appRoutesURL } from "../../../app/router/app-routes-URL";
import { CMSPath, genCMSPath } from "../../../features/CMS/CMSTypes";
import styles from "./Breadcrumbs.module.css";
import { Link } from "react-router-dom";
import SvgIcon from "../SvgIcon/SvgIcon";
import { genKeywordsByClassURL } from "../../../app/router/navigation";

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
    svg?: string;
}

export type Breadcrumb = BreadcrumbSimpeType | BreadcrumbContent;

export type BreadcrumbSimple = BreadcrumbContent &  {
    id: BreadcrumbSimpeType;
} 

export const BreadcrumbsData:BreadcrumbSimple[] =[
    {
        id:BreadcrumbSimpeType.CMSAbout,
        name:'О проекте',
        path:appRoutesURL.home
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
        path: appRoutesURL.authors
    },
    {
        id:BreadcrumbSimpeType.SourcesList,
        name:'Список источников',
        path: appRoutesURL.sources
    },
    {
        id:BreadcrumbSimpeType.IdeasList,
        name:'Список идей',
        path: appRoutesURL.ideas
    },
    {
        id:BreadcrumbSimpeType.KeywordsList,
        name:'Ключевые слова',
        path: genKeywordsByClassURL(0)
    },

];
 
export type BreadcrumbsProps = {
    breadcrumbElementTypes: Breadcrumb[];
    header?:string;
}

export const Breadcrumbs:FC<BreadcrumbsProps>=({breadcrumbElementTypes : bets, header})=>{
    return <nav className={styles.nav}>
        <ul>
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
            return <li key={cnt}><Link to={bd.path}
                key={`bc_${cnt}`}
                className={styles.icon_item}>
                {bd.svg && bd.svg.length>0 && 
                    <SvgIcon
                        svgString={bd.svg}
                        className={styles.icon}
                />}
                {bd.name}</Link>
                </li>;
            
        })}
        {header && <li key="header"><h1>{header}</h1></li>}
        </ul>
    </nav>

}

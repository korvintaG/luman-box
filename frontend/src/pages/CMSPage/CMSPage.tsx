import React, { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ErrorMessageUI } from "../../shared/ui/ErrorMessage/ErrorMessage";
import { CMSData } from "../../features/CMS/constants/CMSData";

export const CMSPage:FC=() => {
    const { article } = useParams();
    const found=useMemo(()=>CMSData.find(el=>el.name===article),[article]);
    if (found )
        return <found.element/>
    else
        return <ErrorMessageUI error={`Недопустимый ID CMS=${article}`}/>
};

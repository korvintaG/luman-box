import { FC } from "react";
import { useParams } from "react-router-dom";
import { ErrorMessageUI } from "../../shared/ui/ErrorMessage/ErrorMessage";
import { CMSData } from "../../features/CMS/CMSTypes";

export const CMSPage: FC = () => {
    const { article } = useParams();
    const found=CMSData.find(el=>el.name===article)
    if (found )
        return <found.element/>
    else
        return <ErrorMessageUI error={`Недопустимый ID CMS=${article}`}/>
};

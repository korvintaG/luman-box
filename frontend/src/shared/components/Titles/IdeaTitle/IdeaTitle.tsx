import { FC } from "react";
import { Link } from "react-router-dom";
import { genIdeaURL } from "../../../../app/router/navigation";

type IdeaTitleProps = {
    ideaID: number;
    ideaName: string;
}

export const IdeaTitle: FC<IdeaTitleProps> = ( {ideaID, ideaName})=>{
    return <span>Текущая идея: [
    <Link to={genIdeaURL(ideaID)}>
        {`${ideaName}`}
    </Link>
        , ID={ideaID}]
    </span>
}

import { FC } from "react"
import { KeywordList } from "../../features/keywords/components/KeywordsList"

export const MainPage: FC = () => {
    return <div>
        <KeywordList gotoKeywordAdd={()=>{}} />
    </div>
}
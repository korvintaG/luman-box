import { FC } from "react"
import { KeywordList } from  "../../domains/keyword/components/KeywordList/KeywordList"

export const MainPage: FC = () => {
    return <div>
        <KeywordList gotoKeywordAdd={()=>{}} />
    </div>
}
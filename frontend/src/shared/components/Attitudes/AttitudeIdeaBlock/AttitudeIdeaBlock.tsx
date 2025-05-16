import React, { FC } from 'react';
import { IdeaAttitudes, UserAttitudeIdea } from '../../../../features/ideas/IdeaTypes';
import { Attitude } from '../Attitude/Attitude';
import { XCircleIcon as False0, BellAlertIcon as Important0, CheckCircleIcon as True0, TrashIcon as Trash0, HandThumbUpIcon as Like0, HandThumbDownIcon as Dislike0} from '@heroicons/react/24/outline'
import { XCircleIcon as False1, BellAlertIcon as Important1, CheckCircleIcon as True1, TrashIcon as Trash1, HandThumbUpIcon as Like1, HandThumbDownIcon as Dislike1} from '@heroicons/react/24/solid'
import styles from "./AttitudeIdeaBlock.module.css";

export type AttitudeIdeaBlockProps = {
    ideaID?:number;
    attitudes: IdeaAttitudes;
    setAttitudes?: (attitude:UserAttitudeIdea)=>void;
}

export const AttitudeIdeaBlock: FC<AttitudeIdeaBlockProps> = ({ ideaID, attitudes, setAttitudes}) => {
    if (!ideaID || !attitudes) 
        return null;

    const setAttitude = (name:string, value: number) => {
        if (setAttitudes)
            setAttitudes({id:ideaID, [name]:value})
    }

    return <section className={styles.container}>
    <Attitude title='Нравится?'
        hintLike="Идея очень нравится!"
        hintLikeBit="Идея в целом нравится"
        hintDisLike="Идея совершенно не нравится!"
        hintDisLikeBit="Идея не нравится"
        LikeNotSelected={Like0} LikeYesSelected={Like1} 
        DisLikeNotSelected={Dislike0} DisLikeYesSelected={Dislike1} 
        receivedUser={attitudes.user?attitudes.user.like:undefined}
        setAttitude={(value: number) => setAttitude('like',value)}
        receivedTotal={attitudes.all.like}/>
    <Attitude title='Значимо?'
        hintLike="Идея очень важна, значима!"
        hintLikeBit="Идея в целом важная"
        hintDisLike="Идея совершенно не важна и бессмысленна!"
        hintDisLikeBit="Идея не важная"
        LikeNotSelected={Important0} LikeYesSelected={Important1} 
        DisLikeNotSelected={Trash0} DisLikeYesSelected={Trash1} 
        receivedUser={attitudes.user?attitudes.user.importance:undefined}
        setAttitude={(value: number) => setAttitude('importance',value)}
        receivedTotal={attitudes.all.importance}/>
    <Attitude title='Правдиво?'
        hintLike="Идея полностью правдива!"
        hintLikeBit="Идея кажется правдивой"
        hintDisLike="Идея абсолютно ложна!"
        hintDisLikeBit="Идея похожа на ложь"
        LikeNotSelected={True0} LikeYesSelected={True1} 
        DisLikeNotSelected={False0} DisLikeYesSelected={False1} 
        receivedUser={attitudes.user?attitudes.user.truth:undefined}
        setAttitude={(value: number) => setAttitude('truth',value)}
        receivedTotal={attitudes.all.truth}/>
    </section>
}

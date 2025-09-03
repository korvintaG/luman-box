import React, { FC } from 'react';
import { InterconnectionIcon } from '../InterconnectionIcon/InterconnectionIcon'; 
import { InterconnectionsCount } from '../../../../interconnection/types/query-types'; 

import styles from "./InterconnectionIconsBlock.module.css";
import { interconnectionsTypeInfo } from '../../../../../shared/constants/InterconnectionTypeInfo'; 

export type InterconnectionsIconBlockProps = {
    interconnections:InterconnectionsCount[];
    generateRoute: (tid:number)=>string;
    readOnly: boolean;
}

export const InterconnectionsIconBlock: FC<InterconnectionsIconBlockProps> = 
    ({ generateRoute, interconnections, readOnly}) => {
    if (!interconnections) 
        return null;
    return <div className={styles.container}>
        {interconnectionsTypeInfo.map((el,cnt)=>{
                const found=interconnections.find(fel=>fel.id===el.id);
                if (found && 
                    (!readOnly || (found.cnt1>0 || found.cnt2>0) ))
                    return <InterconnectionIcon
                        key={cnt} 
                        URL={generateRoute(el.id )}
                        interconnectionTypeInfo={el}
                        cnt={[found.cnt1,found.cnt2]}
                    />        
                return null;
            }
         )}
    </div>
}    

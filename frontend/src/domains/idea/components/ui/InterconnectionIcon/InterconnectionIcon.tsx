import React, { FC, useState } from 'react';
import styles from "./InterconnectionIcon.module.css";
import clsx from 'clsx';
import { Tooltip } from "react-tooltip";
import { translit } from '../../../../../shared/utils/utils'; 
import { Link } from 'react-router-dom';
import { InterconnestionPosition, InterconnectionTypeInfo } from '../../../../interconnection/types/UI-types'; 
export type InterconnectionIconProps = {
  cnt: number[];
  interconnectionTypeInfo: InterconnectionTypeInfo;
  URL: string;
}

export const InterconnectionIcon: FC<InterconnectionIconProps> = ({URL, 
    interconnectionTypeInfo : iTI,  ...props}) => {
    const isGrid=iTI.countPosition && 
    iTI.countPosition === InterconnestionPosition.leftCenterRightCenter;
    const clsxPars={
      [styles.topLeftBottomCenter]:!iTI.countPosition ||
      iTI.countPosition === InterconnestionPosition.topLeftBottomCenter,
      [styles.flex]:!isGrid,
      [styles.leftCenterRightCenter]:iTI.countPosition && 
      iTI.countPosition === InterconnestionPosition.leftCenterRightCenter,
      [styles.topLeftBottomRight]:iTI.countPosition && 
      iTI.countPosition === InterconnestionPosition.topLeftBottomRight,
      [styles.grid]:isGrid
    };
    const cnt1=props.cnt[0];
    const cnt2=props.cnt[1];
    return <Link 
      to={URL}
      className={clsx(styles.container,clsxPars)}
      data-tooltip-id={translit(iTI.hintFromIdea)}
      data-tooltip-content={iTI.hintFromIdea}
    >
        <p className={clsx(styles.cnt1,clsxPars)}> {cnt1===0?'':cnt1} </p>
        {isGrid && <div className={styles.blank}></div> /* лишний элемент для грида */}
        <iTI.icon className={styles.icon} />     
        <p className={clsx(styles.cnt2,clsxPars)}> {cnt2===0?'':cnt2} </p>
        <Tooltip id={translit(iTI.hintFromIdea)} 
          delayShow={500} place="top" border="1px solid black" className={styles.hint}/>
    </Link>
}
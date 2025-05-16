import React, { FC, useState } from 'react';
import styles from "./Attitude.module.css";
import clsx from 'clsx';
import { Tooltip } from "react-tooltip";
import { translit } from '../../../utils/utils';
import { ScaleLabel } from './ScaleLabel';

export type AttitudeProps = {
  receivedTotal: number[];
  receivedUser?: number;
  setAttitude?: (value:number)=>void;
  title: string;
  hintLike: string
  hintLikeBit: string
  hintDisLike: string
  hintDisLikeBit: string
  LikeNotSelected: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  LikeYesSelected: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  DisLikeNotSelected: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  DisLikeYesSelected: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

type ScaleProps = {
  selectedValue?: number;
  receivedUser?: number;
  orderArray: number[];
  handleClick: (value: number) => void;
  getHintByValue: (value: number) => string;
  title: string;
}

const Scale: FC<ScaleProps> = ({ title, selectedValue, orderArray, receivedUser, handleClick, getHintByValue}) => {
  return <div className={styles.scaleContainer}>
    <div className={styles.line} />
    {orderArray.map((value, no) => (
      <div
        key={value}
        className={styles.tick}
        onClick={receivedUser!=null ? () => handleClick(value) : undefined}
        data-tooltip-id={`scale${value}`+translit(title)}
        data-tooltip-content={getHintByValue(value)}          
      >
        {selectedValue === value && receivedUser!=null ?
          <div className={clsx(styles.circle, { 
            [styles.selected]: [1,4].includes(value), 
            [styles.zero]: value === 0 ,
            [styles.selectedBit]: [2,3].includes(value)
          })}
          /> :
          <div
            className={clsx({
              [styles.dashMax] : [1,4].includes(value) ,
              [styles.dashMin]: value===0 ,
              [styles.dashMiddle]:[2,3].includes(value)}
            )}
          />}
      </div>))}
    </div>
}


export const Attitude: FC<AttitudeProps> = ({ title, hintLike, hintDisLike,hintLikeBit, hintDisLikeBit,
    receivedTotal, receivedUser, setAttitude,
    LikeNotSelected, LikeYesSelected, DisLikeNotSelected: DisLikeNotSelected, DisLikeYesSelected }) => {
  const viewTotal = [receivedTotal[1], receivedTotal[2], receivedTotal[0], receivedTotal[3], receivedTotal[4]];
  const scaleHints:string[]=["Не могу определиться с оценкой",hintLike,hintLikeBit,hintDisLikeBit,hintDisLike];
  const [selectedValue, setSelectedValue] = useState<number|undefined>(receivedUser); // хранит выбранное значение
  const orderArray = [1, 2, 0, 3, 4];
  const reOrderArray = [2, 0, 1, 3, 4];
  //console.log('Attitude receivedUser',receivedUser)

  const setValueAndPost = (value:number) => {
    setSelectedValue(value);
    if (setAttitude)
      setAttitude(value);
  }

  const handleClick = (value: number) => {
    setValueAndPost(value);
  };


  const getHintByValue= (num: number): string =>{
    if ([0,1,2,3,4].includes(num))
      return scaleHints[num];
    return '';
  }

  const pressIcon=(event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    //console.log('pressIcon event.currentTarget.dataset.id',event.currentTarget.dataset.id);
    handleClick(Number(event.currentTarget.dataset.id!));
  }

  // LIKE Icon
  let LikeComponent=LikeNotSelected;
  if (selectedValue && [1,2].includes(selectedValue))
    LikeComponent=LikeYesSelected;
  let propsLike:any={
      "data-tooltip-id":"like"+translit(title),
      "data-tooltip-content":hintLike,
      "data-id":"1", 
      className:clsx(styles.icon, styles.iconFull)
  };
  if (receivedUser!=null)
    propsLike={...propsLike, onClick:pressIcon}

  // DISLIKE Icon
  let DisLikeComponent=DisLikeNotSelected;
  if (selectedValue && [3,4].includes(selectedValue))
    DisLikeComponent=DisLikeYesSelected;
  let propsDisLike:any={
      "data-tooltip-id":"dislike"+translit(title),
      "data-tooltip-content":hintDisLike,
      "data-id":"4", 
      className:clsx(styles.icon, styles.iconFull)
  };
  if (receivedUser!=null)
    propsDisLike={...propsDisLike, onClick:pressIcon}

  return (<div className={styles.container}>
      <LikeComponent {...propsLike} />
      <Tooltip id={"like"+translit(title)}  delayShow={500} 
        place="top-start" border="1px solid black" className={styles.hint} />
      <div className={styles.mainContainer}>
        <h6 className={styles.title}>{title}</h6>
        <Scale {...{title, handleClick , getHintByValue, selectedValue, orderArray, receivedUser}}/>
        <ScaleLabel labels={viewTotal} receivedUser={receivedUser} selectedValue={selectedValue} />
      </div>
      {/* выносим на уровень вверх подсказки, чтобы не глючили */}
      {orderArray.map((value)=>{
        return <Tooltip id={`scale${value}`+translit(title)}  
          delayShow={500}
          place="top-start" 
          border="1px solid black" 
          className={styles.hint} />      
      })}
      <DisLikeComponent {...propsDisLike} />
      <Tooltip id={"dislike"+translit(title)} delayShow={500} place="top" border="1px solid black" className={styles.hint}/>
  </div>
  );
};


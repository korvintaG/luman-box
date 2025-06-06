import React, { FC, useState } from "react";
import styles from "./Attitude.module.css";
import { Tooltip } from "react-tooltip";
import { translit } from "../../../utils/utils";
import { ScaleLabels } from "../ScaleLabels";
import { Scale } from "../Scale/Scale";
import {
  IconProps,
  attitudeDisLikeArray,
  attitudeLikeArray,
  attitudeOriginalArray,
  attitudeViewArray,
} from "../attitudeTypes";

export type AttitudeProps = {
  title: string;
  attitudesTotal: number[]; // как в базе оценили все
  attitudeUser?: number; // как в базе оценил текщий пользователь
  setAttitude?: (value: number) => void;
  hintLike: string;
  hintLikeBit: string;
  hintDisLikeBit: string;
  hintDisLike: string;
  LikeNotSelected: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  LikeYesSelected: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  DisLikeNotSelected: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  DisLikeYesSelected: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const Attitude: FC<AttitudeProps> = (props) => {
  const scaleHints: string[] = [
    "Не могу определиться с оценкой",
    props.hintLike,
    props.hintLikeBit,
    props.hintDisLikeBit,
    props.hintDisLike,
  ];
  const readOnly = (props.attitudeUser === undefined);
  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    props.attitudeUser
  ); // хранит выбранное пользователем значение

  const setValueAndPost = (value: number) => {
    setSelectedValue(value);
    if (props.setAttitude) props.setAttitude(value);
  };

  const handleClick = (value: number) => {
    setValueAndPost(value);
  };

  const getHintByValue = (num: number): string => {
    if (attitudeOriginalArray.includes(num)) return scaleHints[num];
    return "";
  };

  const pressIcon = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    handleClick(Number(event.currentTarget.dataset.id!));
  };

  // LIKE Icon
  let LikeComponent = props.LikeNotSelected;
  if (selectedValue && attitudeLikeArray.includes(selectedValue))
    LikeComponent = props.LikeYesSelected;
  let propsLike: IconProps = {
    "data-tooltip-id": "like" + translit(props.title),
    "data-tooltip-content": props.hintLike,
    "data-id": "1",
    className: styles.icon,
  };
  if (!readOnly)
    propsLike = { ...propsLike, onClick: pressIcon };

  // DISLIKE Icon
  let DisLikeComponent = props.DisLikeNotSelected;
  if (selectedValue && attitudeDisLikeArray.includes(selectedValue))
    DisLikeComponent = props.DisLikeYesSelected;
  let propsDisLike: IconProps = {
    "data-tooltip-id": "dislike" + translit(props.title),
    "data-tooltip-content": props.hintDisLike,
    "data-id": "4",
    className: styles.icon,
  };
  if (!readOnly)
    propsDisLike = { ...propsDisLike, onClick: pressIcon };

  const hintProps = {
    delayShow: 500,
    border: "1px solid black",
    className: styles.hint,
  };

  return (
    <div className={styles.container}>
      <LikeComponent {...propsLike} />
      <Tooltip
        id={"like" + translit(props.title)}
        place="top-start"
        {...hintProps}
      />
      <div className={styles.mainContainer}>
        <h6 className={styles.title}>{props.title}</h6>
        <Scale
          readOnly={readOnly}
          title={props.title}
          handleClick={handleClick}
          getHintByValue={getHintByValue}
          attitudeNow={selectedValue}
        />
        <ScaleLabels
          attitudesTotal={props.attitudesTotal}
          attitudeWas={props.attitudeUser}
          attitudeNow={selectedValue}
        />
      </div>
      {/* выносим на уровень вверх подсказки, чтобы не глючили */}
      {attitudeViewArray.map((value, no) => {
        return (
          <Tooltip
            key={no}
            id={`scale${value}` + translit(props.title)}
            place="top-start"
            {...hintProps}
          />
        );
      })}
      <DisLikeComponent {...propsDisLike} />
      <Tooltip
        id={"dislike" + translit(props.title)}
        place="top"
        {...hintProps}
      />
    </div>
  );
};

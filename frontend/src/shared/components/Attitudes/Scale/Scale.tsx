import { FC } from "react";
import clsx from "clsx";
import {
  attitudeNotStrongCaseArray,
  attitudeStrongCaseArray,
  attitudeViewArray,
} from "../attitudeTypes";
import { translit } from "../../../utils/utils";
import styles from "./Scale.module.css";

export type ScaleProps = {
  title: string;
  readOnly: boolean;
  attitudeNow?: number; // как оценено сейчас
  handleClick: (value: number) => void;
  getHintByValue: (value: number) => string;
  dataCy?: string;
};

export const Scale: FC<ScaleProps> = ({
  title,
  readOnly,
  attitudeNow,
  handleClick,
  getHintByValue,
  dataCy,
}) => {
  return (
    <div className={styles.scaleContainer}>
      
      <div className={styles.line} />
      {attitudeViewArray.map((value, index) => (
        <div
          key={value}
          data-cy={dataCy ? `${dataCy}-${index}` : undefined}
          className={clsx(styles.tick, {
            [styles.tick_active]: !readOnly,
          })}
          onClick={readOnly ? undefined : () => handleClick(value) }
          data-tooltip-id={`scale${value}` + translit(title)}
          data-tooltip-content={getHintByValue(value)}
        >
          {attitudeNow === value && !readOnly ? (
            <div
              className={clsx(styles.circle, {
                [styles.selected]: attitudeStrongCaseArray.includes(value),
                [styles.zero]: value === 0,
                [styles.selectedBit]:
                  attitudeNotStrongCaseArray.includes(value),
              })}
            />
          ) : (
            <div
              className={clsx({
                [styles.dashMax]: [1, 4].includes(value),
                [styles.dashMin]: value === 0,
                [styles.dashMiddle]: [2, 3].includes(value),
              })}
            />
          )}
        </div>
      ))}
    </div>
  );
};

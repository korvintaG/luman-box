import { FC } from "react";
import styles from "./ScaleLabels.module.css";
import { attitudeReverseArray } from "../attitudeTypes";

export type ScaleLabelsProps = {
  attitudesTotal: number[];
  attitudeNow?: number; // выбранное сейчас пользователем
  attitudeWas?: number; // ранее полученное выбранное пользователем, то, что включено ранее в labels
};

export const ScaleLabels: FC<ScaleLabelsProps> = ({
  attitudesTotal,
  attitudeNow,
  attitudeWas,
}) => {
  const viewTotal = [
    attitudesTotal[1],
    attitudesTotal[2],
    attitudesTotal[0],
    attitudesTotal[3],
    attitudesTotal[4],
  ];

  const getScaleLabel = (count: number, no: number): string => {
    if (no === 2)
      // не определено
      return "";
    if (!(attitudeNow != null)) {
      if (count !== 0) return String(count);
      else return "";
    }
    if (attitudeWas == null) {
      // ранее не означено
      if (no === attitudeReverseArray[attitudeNow]) {
        return String(count + 1);
      } else {
        return String(count);
      }
    } else {
      // и selectedValue и receivedUser означены
      const selectedNum = attitudeReverseArray[attitudeNow];
      const recievedNum = attitudeReverseArray[attitudeWas];
      if (no === selectedNum) {
        // текущий есть явно выбранный пользователем
        if (recievedNum === no) {
          if (recievedNum === selectedNum) {
            return String(count);
          } else {
            return String(count - 1);
          }
        } else return String(count + 1);
      } else {
        if (no === recievedNum) {
          return String(count - 1);
        }
        if (count === 0) return "";
      }
    }
    if (count != 0) return String(count);
    else return "";
  };

  return (
    <div className={styles.labelContainer}>
      {viewTotal.map(
        (
          count,
          no // 1 2 0 3 4
        ) => (
          <div key={no} className={styles.label}>
            <p>{getScaleLabel(count, no)}</p>
          </div>
        )
      )}
    </div>
  );
};

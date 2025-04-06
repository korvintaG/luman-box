import { FC } from 'react';
import styles from "./attitude.module.css";

export type ScaleLabelProps = {
    labels: number[]; // уже массив меток упорядоченный 1 2 0 3 4 
    selectedValue?: number; // выбранное сейчас пользователем 
    receivedUser?: number; // ранее полученное выбранное пользователем, то, что включено ранее в labels
  }
  
export const ScaleLabel: FC<ScaleLabelProps> = ({ labels, selectedValue, receivedUser}) => {
  const reOrderArray = [2, 0, 1, 3, 4];

  const getScaleLabel = (count: number, no: number): string => {
    //console.log('getScaleLabel','no=',no,'count=',count,'receivedUser=',receivedUser,'selectedValue=',selectedValue)
    if (no === 2) // не определено
      return '';
    if (!(selectedValue!=null)) {
        //console.log('  getScaleLabel selectedValue==null')
        if (count!==0)
            return String(count);
        else
            return '';
    }
    if (receivedUser==null) { // ранее не означено
        //console.log('  getScaleLabel receivedUser==null')
        if (no === reOrderArray[selectedValue]) {
            //console.log('  getScaleLabel no === reOrderArray[selectedValue]')
            return String(count+1);
        }
        else {
            //console.log('  getScaleLabel no !== reOrderArray[selectedValue]')
            return String(count);
        }
    }
    else {// и selectedValue и receivedUser означены
        const selectedNum=reOrderArray[selectedValue];
        const recievedNum=reOrderArray[receivedUser];
        //console.log('  getScaleLabel selectedNum=',selectedNum,'recievedNum=',recievedNum)
        if (no === selectedNum) { // текущий есть явно выбранный пользователем
            //console.log('  getScaleLabel no === selectedNum',selectedNum)
            if (recievedNum===no) {
                //console.log('  getScaleLabel recievedNum===no',no)
                if (recievedNum===selectedNum) {
                    //console.log('  getScaleLabel recievedNum===selectedNum')
                    return String(count);
                }
                else {
                    //console.log('  getScaleLabel recievedNum!==selectedNum')
                    return String(count-1);
                }
            }
            else
                return String(count + 1);
        }
        else {
            if (no === recievedNum) {
                //console.log('  getScaleLabel no === recievedNum',recievedNum)
                return String(count -1);
            }
            if (count === 0)
                return '';
        }
    }
    if (count!=0)
        return String(count);
    else
        return '';
  }

    return <div className={styles.labelContainer}>
    {labels.map((count, no) => ( // 1 2 0 3 4 
      <div
        key={no}
        className={styles.label}
      >
        <p>{getScaleLabel(count, no)}</p>
      </div>
    ))}
  </div>
  }
  
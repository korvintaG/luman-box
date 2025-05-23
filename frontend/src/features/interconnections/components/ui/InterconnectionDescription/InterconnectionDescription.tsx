import { ChangeEvent, FC } from "react"
import styles from "./InterconnectionDescription.module.css";
import { HTMLEditElement } from "../../../../../shared/common-types";
import { InputTextUI } from "../../../../../shared/ui/fields/input-text/input-text";
import ArrowIcon from "../../../../../shared/ui/icons/ArrowIcon/ArrowIcon";
import { InterconnectionTypeInfo } from "../../../InterconnectionTypes";
import clsx from "clsx";


export type InterconnectionDescriptionProp = {
    nameDirect: string;
    nameReverse: string;
    handleChange: (event: ChangeEvent<HTMLEditElement>) => void;
    ideaTypeInfo?: InterconnectionTypeInfo;
    readOnly?: boolean;
}
export const InterconnectionDescription: FC<InterconnectionDescriptionProp> = 
    ( { nameDirect, nameReverse, handleChange, ideaTypeInfo, readOnly}) => {
    return <div className={styles.middle}>
        {<InputTextUI
            value={nameDirect}
            name="nameDirect"
            rows={2}
            label="Комментарий к прямой связи:"
            handleChange={handleChange}
            classAdd={styles.direct}
            textClassAdd={styles.input}
            readOnly={readOnly}
            minLength={10}
        />}
        <ArrowIcon className={styles.arrow}/>
        {ideaTypeInfo && <div className={styles.icon_container}><ideaTypeInfo.icon className={styles.icon}/></div>}
        <ArrowIcon className={clsx(styles.arrow, styles.arrow_reverse)}/>
        <InputTextUI
            value={nameReverse}
            rows={2}
            name="nameReverse"
            label="Комментарий к обратной связи:"
            handleChange={handleChange}
            classAdd={styles.reverse}
            textClassAdd={styles.input}
            readOnly={readOnly}
            minLength={10}
        />

    </div>;
    }    


import { ChangeEvent, FC } from "react"
import styles from "./InterconnectionDescription.module.css";
import { HTMLEditElement } from "../../../../../shared/types/types-for-hooks";
import { InputTextUI } from "../../../../../shared/ui/fields/input-text/input-text";
import ArrowIcon from "../../../../../shared/ui/icons/ArrowIcon/ArrowIcon";
import { InterconnectionTypeInfo } from "../../../types/UI-types";
import clsx from "clsx";
import { Classes } from "../../../../../shared/types/ui-types";


export type InterconnectionDescriptionProp = {
    nameDirect: string;
    nameReverse: string;
    handleChange: (event: ChangeEvent<HTMLEditElement>) => void;
    ideaTypeInfo?: InterconnectionTypeInfo;
    readOnly?: boolean;
}
export const InterconnectionDescription: FC<InterconnectionDescriptionProp> = 
    ( { nameDirect, nameReverse, handleChange, ideaTypeInfo, readOnly}) => {
    const classes:Classes = {classInputAdd:styles.input, classAdd: styles.input_block};
    return <div className={styles.middle}>
        {<InputTextUI
            value={nameDirect}
            name="name_direct"
            rows={2}
            label="Комментарий к прямой связи:"
            onChange={handleChange}
            dataCy="interconnection-name-direct"
            readOnly={readOnly}
            minLength={10}
        />}
        {/*classBlockAdd={styles.direct}*/}
        <ArrowIcon className={styles.arrow}/>
        {ideaTypeInfo && <div className={styles.icon_container}><ideaTypeInfo.icon className={styles.icon}/></div>}
        <ArrowIcon className={clsx(styles.arrow, styles.arrow_reverse)}/>
        <InputTextUI
            value={nameReverse}
            rows={2}
            name="name_reverse"
            label="Комментарий к обратной связи:"
            onChange={handleChange}
            readOnly={readOnly}
            dataCy="interconnection-name-reverse"
            minLength={10}
        />
        {/*classBlockAdd={styles.reverse}*/}

    </div>;
    }    


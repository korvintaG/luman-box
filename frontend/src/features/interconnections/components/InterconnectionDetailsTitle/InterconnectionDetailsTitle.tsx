import { FC } from "react";
import styles from "./InterconnectionDetailsTitle.module.css";

export const InterconnectionDetailsTitle: FC<{typeName?:string}>=({typeName})=>
<h1 className={styles.title}>
    Взаимосвязь между идеями типа [<span>{typeName}</span>]
</h1>
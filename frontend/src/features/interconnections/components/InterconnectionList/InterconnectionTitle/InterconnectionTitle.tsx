import { FC } from "react";
import styles from "./InterconnectionTitle.module.css";

export const InterconnectionTitle: FC<{typeName?:string}>=({typeName})=>
<h1 className={styles.title}>
    Взаимосвязь между идеями типа [<span>{typeName}</span>]
</h1>
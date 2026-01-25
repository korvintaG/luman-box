import { FC } from "react"
import styles from './div-spacer.module.scss'

export type DivSpacerProps = {
    size?: 'middle' | 'small',
    count?: number
}
export const DivSpacer:FC<DivSpacerProps> = ({size='small', count=2})=>{
    
    return <>
     {Array.from({ length: count }, (_, index) => (
       <div key={index} className={styles[size]}></div>
     ))}
    </>
}
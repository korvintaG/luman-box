import { FC } from 'react';
import styles from './about-card.module.css'


export type AboutCardUIProps = {
    backgroundImage: string;
    icon: string;
    text: string;  
}

export const AboutCardUI: FC<AboutCardUIProps> = ({backgroundImage, icon, text}) => {

    return <article className={styles.article}
        style={{
        backgroundImage: `url(${(backgroundImage)})`
        }}>
        <div className={`${styles.overlay} ${styles.card_content}`}>
            <img src={icon} className={styles.icon} />
            <div dangerouslySetInnerHTML={
                { __html: text }}>
            </div>
        </div>
    </article>
}
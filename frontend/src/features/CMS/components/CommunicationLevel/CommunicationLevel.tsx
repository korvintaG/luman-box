import { SimpleComponentType } from "../../CMSTypes";
import styles from "../CMS.module.css";
import access from "../../../../assets/images/access.jpg";

export const CommunicationLevelCMS: SimpleComponentType = () => {
    return <main className={styles.main}>
        <h1>Как в системе выбирать уровень доступности в общении?</h1>
        <section>
            <figure>
                <picture>
                    <img src={access} alt="Человек, запирающий информационные входы" />
                </picture>
                <figcaption>
                    Надо управлять своей доступностью!
                </figcaption>
            </figure>
            <div>
                <p>У нас есть два основных уровня доступности:
                    <ul>
                        <li>Полностью <span>открытый</span> - позволяет другим пользователям писать Вам сообщения;</li>
                        <li>Полностью <span>закрытый</span> (по умолчанию) - другие пользователи не смогут Вам слать сообщения, а общаться с Вами смогут лишь косвенно, реагируя добавлением своих идей на Ваши.</li>
                    </ul>
                </p>
                <p>
                    Мы настоятельно рекомендуем закрытую доступность. Мессенджеров полно сейчас самых разных. А вот совместно безличностно мыслить удобней всего у нас!
                </p>
            </div>
        </section>
    </main>
}
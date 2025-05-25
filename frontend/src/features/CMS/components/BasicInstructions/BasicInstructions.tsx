import { appRoutes, telegramBotURL } from "../../../../app/router/AppRoutes";
import { SimpleComponentType } from "../../CMSTypes";
import styles from "../CMS.module.css";
import manual from "../../../../assets/images/manual.png";

export const BasicInstructionsCMS : SimpleComponentType = ()=>{
    return <main className={styles.main}>
    <h1>Краткая инструкция по работе с системой</h1>
    <section>
            <figure>
                <picture>
                    <img src={manual} />
                </picture>
                <figcaption>
                    Краткие инструкции
                </figcaption>
            </figure>

    <p>Чтобы начать работать с системой, необходимо:
        <ul >
            <li>Войти в наш <a href={telegramBotURL}>Telegram-бот</a> и зарегистрироваться в системе;</li>
            <li>По полученным в Telegram-боте логину и паролю <a href={appRoutes.auth}>войти в систему</a>;</li>
            <li>После успешной авторизации Вы сможете:
                <ul>
                    <li>Добавлять новых <a href={appRoutes.authors}>авторов</a>;</li>
                    <li>Добавлять новые <a href={appRoutes.sources}>источники</a>;</li>
                    <li>Добавлять новые <a href={appRoutes.ideas}>идеи</a>;</li>
                    <li>Добавлять новые <a href={appRoutes.keywords}>ключевые слова</a>;</li>
                    <li>Добавлять новые взаимосвязи идей;</li>
                    <li>Оценивать идеи;</li>
                    <li>Оценивать взаимосвязи идей.</li>
                </ul>
            </li>
        </ul>
    </p>
    </section>
   </main>
}
import { appRoutes, telegramBotURL } from "../../../../app/router/AppRoutes";
import { SimpleComponentType } from "../../CMSTypes";
import styles from "../CMS.module.css";
import telegram from "../../../../assets/images/Telegram.png";


export const TelegramAuthorizationCMS : SimpleComponentType = ()=>{
    return <main className={styles.main}>
    <h1>Зачем нужна регистрация через Telegram?</h1>
    <section>
        <figure>
            <picture>
                <img src={telegram}/>
            </picture>
            <figcaption>
                Вход через Telegram!
            </figcaption>
        </figure>

        <div>
            <p>
                Свобода слова это конечно хорошо, но нужна и ответственность. Нужно как то идентифицировать
                конкретного пользователя. Причем желательно анонимно, чтобы такая привязка никак не могла 
                навредить пользователю ресурса. На наш взгляд наилучший вариант - это идентификация через Telegram chat_id.
                Система знает о посетителе только его chat_id, а через Telegram chat_id невозможно узнать № телефона.
                Т.е. с одной стороны у нас есть однозначная идентификация пользователя, а с другой стороны
                конфиденциальности наших посетителей ничего не угрожает!
            </p>
            <p>
                Чтобы зарегистрироваться в нашей системе, Вам нужно перейти в 
                наш <a href={telegramBotURL}>Telegram-бот</a>,
                выбрать желаемый логин и пароль. И уже с этими 
                логином/паролем <a href={appRoutes.auth}>войти в систему</a>.
            </p>
        </div>
    </section>

   </main>
}
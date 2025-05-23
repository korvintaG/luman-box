import { SimpleComponentType } from "../../CMSTypes";
import styles from "../CMS.module.css";

export const PremoderationCMS : SimpleComponentType = ()=>{
    return <main className={styles.main}>
    <h1>Необходимость премодерации в информационных ресурсах</h1>
    <p>На наш взгляд, премодерация нужна не только для того, чтобы нечаянно не нарушить закон и не 
        попасть под его карающую руку. Главная проблема подавляющей части публичных Интернет-ресурсов
        это их <span>низкая информационная ценность</span>. Которая заключается в следующем:
        <ul>
            <li>большое содержание низкоинформативных эмоциональных сообщений. Наподобие <span>"ты дурак, сам дурак, от дурака слышу"</span>;</li>
            <li>высокий уровень <span>дублирования информации</span> - одно и то же формулируется сотнями разных способов без привнесения какой бы то ни было информационной ценности;</li>
            <li><span>низкий уровень владения родным языком</span>, что приводит к орфографическим и синтаксическим ошибкам, а также к плохому пониманию сформулированного текста читателями;</li>
            <li>пометка добавляемой информации тэгами или ключевыми словами (там где она есть) осуществляется авторами случайным образом, потому смысл тэгов теряется.</li>
        </ul>
    </p>
    <p>
        Премодерация позволяет решить все эти проблемы. А именно:
        <ul>
            <li>Премодерируются все добавляемые <span>авторы</span> - проверяется факт их существования вообще и дубляжа в базе;</li>
            <li>Премодерируются все добавляемые <span>источники</span> - проверяется корректность названия источника, авторы и т.д.;</li>
            <li>Премодерируются все добавляемые <span>идеи</span>:
                <ul>
                    <li>проверяется наличие цитаты в источнике;</li>
                    <li>проверяется связь цитаты и добавляемой идеи;</li>
                    <li>проверяется отсутствие эмоций в названии и формулировке добавляемой идеи;</li>
                </ul>
            </li>
            <li>Премодерируются все добавляемые <span>ключевые слова</span>:
                <ul>
                    <li>новые ключевые слова рассортировываются по иерархии;</li>
                    <li>новые ключевые слова проверяются на синонимы и антонимы;</li>
                    <li>проверяется корректность назначения ключевых слов на идею по специальному алгоритму;</li>
                    <li>удаляются лишние для идеи ключевые слова;</li>
                    <li>добавляются новые ключевые для идеи слова, которые автор не добавил;</li>
                </ul>
            </li>
        </ul>
    </p>
    <p>
        Планируется, что вначале премодерацию будет осуществлять живой человек. 
        Но по мере накопления опыта можно будет передать большую часть этой работы ИИ-боту.
    </p>
   </main>
}
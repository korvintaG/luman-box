import { AboutCards } from "./AboutCardTypes";
import BaseIcon from "../../assets/images/Base.png";
import BaseImage from "../../assets/images/BaseBackground.png";
import ModerateIcon from "../../assets/images/Moderate.png";
import ModerateImage from "../../assets/images/ModerateBackground.png";
import CompetitionIcon from "../../assets/images/Competition.png";
import CompetitionImage from "../../assets/images/CompetitionBackground.png";
import TelegramIcon from "../../assets/images/Telegram.png";
import TelegramImage from "../../assets/images/TelegramBackground.png";
import SupporterIcon from "../../assets/images/Supporter.png";
import SupporterImage from "../../assets/images/SupporterBackground.png";
import BannedIcon from "../../assets/images/Banned.png";
import BannedImage from "../../assets/images/BannedBackground.png";

/**
 * Данные для карточек - нюансов о системе
 */
export const aboutCards: AboutCards[] = [
  {
    id: 1,
    text: 'Добро пожаловать в бесплатную публичную базу знаний  по саморазвитию, и связанным с ним гуманитарным наукам. Знания в базе организованы по <a href="">методу ZettelKasten</a>. Дискуссии и ветвления знаний происходят по принципам,  изложенным <a href="">Мортимером Адлером</a>.',
    icon: BaseIcon,
    image: BaseImage,
  },
  {
    id: 2,
    text: 'Данный ресурс не является развлекательным, а исключительно информационным. Потому все новые идеи, добавляемые Вами, проходят <a href="">премодерацию</a>. Тем самым Вы видите только качественно оформленные знания, и взаимодействуете с системой комфортно и только по существу.',
    icon: ModerateIcon,
    image: ModerateImage,
  },
  {
    id: 3,
    text: 'Основным принципом построения нашей базы знаний являются <a href="">конкурирующие интерпретации</a>. Потому иное мнение не только разрешается, но и всячески приветствуется! В спорах рождается истина! А мы гарантируем, что никакой спор никогда не перерастет в ругань!',
    icon: CompetitionIcon,
    image: CompetitionImage,
  },
  {
    id: 4,
    text: 'Чтобы пользоваться полным функционалом нашей базы знаний, необходимо <a href="">авторизоваться через мессенджер Telegram</a>. Это очень просто, делается всего лишь один раз и не займет более пяти минут. Данный метод авторизации был выбран нами, как компромисс между анонимностью и безопасностью.',
    icon: TelegramIcon,
    image: TelegramImage,
  },
  {
    id: 5,
    text: 'С помощью нашей системы Вы не только легко сможете <a href="">находить себе единомышленников</a>, но и самому <a href="">выбирать уровень общения с ними</a> - от самого плотного в реальном мире до обезличенного, просто удаленно  работая над одними и теми же знаниями на сайте.',
    icon: SupporterIcon,
    image: SupporterImage,
  },
  {
    id: 6,
    text: 'В отличии от других ресурсов, мы никогда никого не баним. Любое мнение имеет право на существование! Не противоречащее законодательству РФ, разумеется! Не бойтесь, <a href="./authors">добавляйте новых авторов</a>, <a href="./sources">новые источники</a>, <a href="./ideas">идеи</a>, <a href="./keywords">ключевые слова</a>! Мы подскажем, научим, поможем! ',
    icon: BannedIcon,
    image: BannedImage,
  },
];

import { IAboutCard } from "../AboutCardTypes";
import { CMSPath, genCMSPath } from "../../CMS/CMSTypes";
import { appRoutesURL } from "../../../app/router/AppRoutesURL";
import { CogManIcon } from "../../../shared/ui/icons/CogManIcon/CogManIcon";
import { TugOfWarIcon } from "../../../shared/ui/icons/TugOfWarIcon/TugOfWarIcon";
import { BannedIcon } from "../../../shared/ui/icons/BannedIcon/BannedIcon";
import { TeamWorkIcon } from "../../../shared/ui/icons/TeamWorkIcon/TeamWorkIcon";
import { TelegramIcon } from "../../../shared/ui/icons/TelegramIcon/TelegramIcon";
import IdeasNetworkIcon from "../../../shared/ui/icons/IdeasNetwork/IdeasNetwork";

/**
 * Данные для карточек - нюансов о системе
 */
export const aboutCardData: IAboutCard[] = [
  {
    id: 1,
    title: 'Публичная сеть идей',
    titleURL: genCMSPath(CMSPath.IdeasNet),
    text: `Добро пожаловать в бесплатную публичную сеть идей по саморазвитию, 
      и связанным с ним гуманитарным наукам. Идеи в системе организованы по 
      <a href="${genCMSPath(CMSPath.ZettelKasten)}">методу ZettelKasten</a>. 
      Дискуссии и ветвления знаний происходят по принципам,  
      изложенным <a href="${genCMSPath(CMSPath.MortimerAdler)}">Мортимером Адлером</a>.`,
    icon: IdeasNetworkIcon,
  },
  {
    id: 2,
    title: 'Премодерация',
    titleURL: genCMSPath(CMSPath.Premoderation),
    text: `Данный ресурс не является развлекательным, а исключительно информационным. 
      Потому все новые идеи, добавляемые Вами, проходят 
      <a href="${genCMSPath(CMSPath.Premoderation)}">премодерацию</a>. 
      Тем самым Вы видите только качественно оформленные знания, и взаимодействуете с 
      системой комфортно и только по существу.`,
    icon: CogManIcon,
  },
  {
    id: 3,
    title: 'Конкурирующие интерпретации',
    titleURL: genCMSPath(CMSPath.CompetingInterpretations),
    text: `Основным принципом построения нашей сети идей являются 
      <a href="${genCMSPath(CMSPath.CompetingInterpretations)}">конкурирующие интерпретации</a>. 
      Потому иное мнение не только разрешается, но и всячески приветствуется! 
      В спорах рождается истина! А мы гарантируем, что никакой спор никогда не 
      перерастет в ругань!`,
    icon: TugOfWarIcon,
  },
  {
    id: 4,
    title: 'Регистрация через Telegram',
    titleURL: genCMSPath(CMSPath.TelegramAuthorization),
    text: `Чтобы пользоваться полным функционалом нашей сети, необходимо 
      <a href="${genCMSPath(CMSPath.TelegramAuthorization)}">зарегестрироваться через 
      мессенджер Telegram</a>. Это очень просто, делается всего лишь один раз и не займет
      более пяти минут. Данный метод авторизации был выбран нами, как компромисс между 
      анонимностью и безопасностью.`,
    icon: TelegramIcon,
  },
  {
    id: 5,
    title: 'Поиск единомышленников',
    titleURL: genCMSPath(CMSPath.LikeMindedPeople),
    text: `С помощью нашей системы Вы не только легко сможете 
      <a href="${genCMSPath(CMSPath.LikeMindedPeople)}">находить себе единомышленников</a>, 
      но и самому <a href="${genCMSPath(CMSPath.CommunicationLevel)}">выбирать уровень 
      общения с ними</a> - от самого плотного в реальном мире до обезличенного, просто 
      удаленно  работая над одними и теми же знаниями на сайте.`,
    icon: TeamWorkIcon,
  },
  {
    id: 6,
    title: 'Нет банов!',
    titleURL: genCMSPath(CMSPath.NotBan),
    text: `В отличии от других ресурсов, мы никогда никого не баним. Любое мнение имеет 
      право на существование! Не противоречащее законодательству РФ, разумеется! 
      Не бойтесь, <a href=${appRoutesURL.authors}>добавляйте новых авторов</a>, 
      <a href=${appRoutesURL.sources}>новые источники</a>, <a href=${appRoutesURL.ideas}>идеи</a>, 
      <a href=${appRoutesURL.keywords}>ключевые слова</a>! Мы подскажем, научим, поможем! `,
    icon: BannedIcon,
  },
];

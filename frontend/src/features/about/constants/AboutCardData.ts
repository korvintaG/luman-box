import { IAboutCard } from "../AboutCardTypes";
import { CMSPath, genCMSPath } from "../../CMS/CMSTypes";
import { CogManIcon } from "../../../shared/ui/icons/CogManIcon/CogManIcon";
import { TugOfWarIcon } from "../../../shared/ui/icons/TugOfWarIcon/TugOfWarIcon";
import { BannedIcon } from "../../../shared/ui/icons/BannedIcon/BannedIcon";
import { TeamWorkIcon } from "../../../shared/ui/icons/TeamWorkIcon/TeamWorkIcon";
import { TelegramIcon } from "../../../shared/ui/icons/TelegramIcon/TelegramIcon";
import IdeasNetworkIcon from "../../../shared/ui/icons/IdeasNetwork/IdeasNetwork";
import { TextPublicIdeaNet } from "../components/AboutCardListTexts/TextPublicIdeaNet/TextPublicIdeaNet";
import { TextPremoderation } from "../components/AboutCardListTexts/TextPremoderation/TextPremoderation";
import { TextTelegram } from "../components/AboutCardListTexts/TextTeleram/TextTelegram";
import { TextLikeMindedPeople } from "../components/AboutCardListTexts/TextLikeMindedPeople/TextLikeMindedPeople";
import { TextNotBanned } from "../components/AboutCardListTexts/TextNotBanned/TextNotBanned";
import { TextCompetingInterpretations } from "../components/AboutCardListTexts/TextCompetingInterpretations/TextCompetingInterpretations";

/**
 * Данные для карточек - нюансов о системе
 */
export const aboutCardData: IAboutCard[] = [
  {
    id: 1,
    title: 'Публичная сеть идей',
    titleURL: genCMSPath(CMSPath.IdeasNet),
    text: TextPublicIdeaNet,
    icon: IdeasNetworkIcon,
  },
  {
    id: 2,
    title: 'Премодерация',
    titleURL: genCMSPath(CMSPath.Premoderation),
    text: TextPremoderation,
    icon: CogManIcon,
  },
  {
    id: 3,
    title: 'Конкурирующие интерпретации',
    titleURL: genCMSPath(CMSPath.CompetingInterpretations),
    text: TextCompetingInterpretations,
    icon: TugOfWarIcon,
  },
  {
    id: 4,
    title: 'Регистрация через Telegram',
    titleURL: genCMSPath(CMSPath.TelegramAuthorization),
    text: TextTelegram,
    icon: TelegramIcon,
  },
  {
    id: 5,
    title: 'Поиск единомышленников',
    titleURL: genCMSPath(CMSPath.LikeMindedPeople),
    text: TextLikeMindedPeople,
    icon: TeamWorkIcon,
  },
  {
    id: 6,
    title: 'Нет банов!',
    titleURL: genCMSPath(CMSPath.NotBan),
    text: TextNotBanned,
    icon: BannedIcon,
  },
];

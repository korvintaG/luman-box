import React from "react";
import { Link } from "react-router-dom";
import { CMSPath, genCMSPath } from "../../../../CMS/CMSTypes";
export const TextTelegram = React.memo(() => {
  return (
    <>
      Чтобы пользоваться полным функционалом нашей сети, необходимо{" "}
      <Link to={genCMSPath(CMSPath.TelegramAuthorization)}>
        зарегестрироваться через мессенджер Telegram
      </Link>
      . Это очень просто, делается всего лишь один раз и не займет более пяти
      минут. Данный метод авторизации был выбран нами, как компромисс между
      анонимностью и безопасностью.
    </>
  );
});

import React from "react";
import { Link } from "react-router-dom";
import { CMSPath, genCMSPath } from "../../../../CMS/CMSTypes";
export const TextAboutUs = React.memo(() => {
  return (
    <>
      Авторы проекта: два человека, <strong>программист</strong> и <strong>социолог</strong>. 
      Каждый - профессионал в своей области. 
      Вместе мы создали проект, который помогает людям публиковать заинтересовавшие их идеи,
      структурировать новые знания, а также делиться им и вместе работать 
      над формированием новых идей.
    </>
  );
});

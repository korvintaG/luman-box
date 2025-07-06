import React from "react";
import { Link } from "react-router-dom";
import { CMSPath, genCMSPath } from "../../../../CMS/CMSTypes";
export const TextLikeMindedPeople = React.memo(() => {
  return (
    <>
      С помощью нашей системы Вы не только легко сможете{" "}
      <Link to={genCMSPath(CMSPath.LikeMindedPeople)}>
        находить себе единомышленников
      </Link>
      , но и самому{" "}
      <Link to={genCMSPath(CMSPath.CommunicationLevel)}>
        выбирать уровень общения с ними
      </Link>{" "}
      - от самого плотного в реальном мире до обезличенного, просто удаленно
      работая над одними и теми же знаниями на сайте.
    </>
  );
});

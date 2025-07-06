import React from "react";
import { Link } from "react-router-dom";
import { CMSPath, genCMSPath } from "../../../../CMS/CMSTypes";
export const TextPublicIdeaNet = React.memo(() => {
  return (
    <>
      Добро пожаловать в бесплатную публичную сеть идей по саморазвитию, и
      связанным с ним гуманитарным наукам. Идеи в системе организованы по{" "}
      <Link to={genCMSPath(CMSPath.ZettelKasten)}>методу ZettelKasten</Link>.
      Дискуссии и ветвления знаний происходят по принципам, изложенным{" "}
      <Link to={genCMSPath(CMSPath.MortimerAdler)}>Мортимером Адлером</Link>.
    </>
  );
});

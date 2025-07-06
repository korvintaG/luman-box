import React from "react";
import { Link } from "react-router-dom";
import { CMSPath, genCMSPath } from "../../../../CMS/CMSTypes";
export const TextCompetingInterpretations = React.memo(() => {
  return (
    <>
      Основным принципом построения нашей сети идей являются{" "}
      <Link to={genCMSPath(CMSPath.CompetingInterpretations)}>
        конкурирующие интерпретации
      </Link>
      . Потому иное мнение не только разрешается, но и всячески приветствуется!
      В спорах рождается истина! А мы гарантируем, что никакой спор никогда не
      перерастет в ругань!`{" "}
    </>
  );
});

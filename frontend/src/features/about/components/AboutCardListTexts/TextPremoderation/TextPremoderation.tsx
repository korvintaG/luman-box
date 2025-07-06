import React from "react";
import { Link } from "react-router-dom";
import { CMSPath, genCMSPath } from "../../../../CMS/CMSTypes";
export const TextPremoderation = React.memo(() => {
  return (
    <>
      Данный ресурс не является развлекательным, а исключительно информационным.
      Потому все новые идеи, добавляемые Вами, проходят{" "}
      <Link to={genCMSPath(CMSPath.Premoderation)}>премодерацию</Link>. Тем
      самым Вы видите только качественно оформленные знания, и взаимодействуете
      с системой комфортно и только по существу.
    </>
  );
});

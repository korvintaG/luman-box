import React from "react";
import { Link } from "react-router-dom";
import { CMSPath, genCMSPath } from "../../../../CMS/CMSTypes";
import { appRoutesURL } from "../../../../../app/router/AppRoutesURL";
export const TextNotBanned = React.memo(() => {
  return (
    <>
      В отличии от других ресурсов, мы никогда никого не баним. Любое мнение
      имеет право на существование! Не противоречащее законодательству РФ,
      разумеется! Не бойтесь,{" "}
      <Link to={appRoutesURL.authors}>добавляйте новых авторов</Link>,{" "}
      <Link to={appRoutesURL.sources}>новые источники</Link>,{" "}
      <Link to={appRoutesURL.ideas}>идеи</Link>,{" "}
      <Link to={appRoutesURL.keywords}>ключевые слова</Link>! Мы подскажем,
      научим, поможем!
    </>
  );
});

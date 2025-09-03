import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../../shared/services/store";
import { SourcesList } from "../components/smart/SourcesList/SourcesList";
import { selectCurrentUser } from "../../../features/auth/store/AuthSlice";
import { genSourceAddURL } from "../../../app/router/navigation";
import { Helmet } from "react-helmet-async";

/**
 * Страница список источников
 */
export const SourceListPage: FC = () => {
  const currentUser = useSelector(selectCurrentUser);

  const navigate = useNavigate();
  const gotoSourceAdd = () => {
    navigate(genSourceAddURL);
  };

  return (
    <>
      <Helmet>
        <title>Список источников</title>
      </Helmet>

      <SourcesList readOnly={!currentUser} gotoSourceAdd={gotoSourceAdd} />
    </>
  );
};

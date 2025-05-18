import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../shared/services/store";
import { SourcesList } from "../../features/sources/components/smart/SourcesList/SourcesList";
import { selectCurrentUser } from "../../features/auth/store/AuthSlice";
import { genSourceAddURL } from "../../app/router/navigation";

/**
 * Страница список источников
 */
export const SourcesListPage: FC = () => {
  const currentUser = useSelector(selectCurrentUser);

  const navigate=useNavigate();
  const gotoSourceAdd = () => {
    navigate(genSourceAddURL)
  }

  return (
    <SourcesList
      readOnly={!currentUser}
      gotoSourceAdd={gotoSourceAdd}
    />
  );
};

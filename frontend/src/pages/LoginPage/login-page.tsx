import { SyntheticEvent, useEffect } from "react";
import { useForm } from "../../shared/hooks/useForm";
import { useSelector, useDispatch } from "../../shared/services/store";
import {
  setStatus,
  login,
  logout,
  selectSliceStatus,
  selectCurrentUser,
  resetStatus,
  selectError,
  selectCurrentLogin,
  AuthStatus,
} from "../../features/auth/store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { appRoutesURL } from "../../app/router/AppRoutesURL";
import { LoginForm } from "../../features/auth/components/login-form/login-form";
import { UserInner } from "../../features/auth/user-types";

const emptyUser: UserInner = {
  name: "",
  password: "",
};

export default function LoginPage() {
  const { values, handleChange, setValues, getFormDTOObl } =
    useForm<UserInner>(emptyUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sliceStatus = useSelector(selectSliceStatus);
  const currentUser = useSelector(selectCurrentUser);
  const currentLogin = useSelector(selectCurrentLogin);
  const error = useSelector(selectError);

  const resetError = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetStatus());
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentUser) {
      dispatch(logout());
    } else dispatch(login({ ...getFormDTOObl() }));
  };

  useEffect(() => {
    if (sliceStatus === AuthStatus.Success) {
      if (currentLogin) {
        setValues(emptyUser); // сброс логина-пароля на странице логина
        dispatch(setStatus(AuthStatus.Idle));
        navigate(appRoutesURL.home);
      }
    }
  }, [sliceStatus, currentUser]);

  return (
    <LoginForm
      values={values}
      status={sliceStatus}
      resetError={resetError}
      error={error}
      currentUser={currentUser}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
    />
  );
}

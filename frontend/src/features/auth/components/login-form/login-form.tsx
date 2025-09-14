import { FC, SyntheticEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { UserInner, User, RoleNames } from "../../user-types";
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit";
import { AuthStatus } from "../../store/AuthSlice";
import { Preloader } from "../../../../shared/ui/Preloader";
import { ErrorMessageUI } from "../../../../shared/ui/ErrorMessage/ErrorMessage";
import { ButtonUI } from "../../../../shared/ui/button";
import styles from "./login-form.module.css";
import { HTMLEditElement } from "../../../../shared/types/types-for-hooks";

export type LoginFormProps = {
  values: UserInner; // поля
  currentUser: User | null;
  status: AuthStatus;
  error: string;
  resetError: (e: SyntheticEvent) => void;
  handleSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLEditElement>) => void;
};

export const LoginForm: FC<LoginFormProps> = (props: LoginFormProps) => {
  if (props.status === AuthStatus.Requesting) return <Preloader />;

  if (props.status === AuthStatus.FailedLogin)
    return (
      <ErrorMessageUI
        errorTitle="Ошибка авторизации"
        error={props.error}
        okCaption="Вернуться"
        okAction={props.resetError}
      />
    );

  const classes = { classLabelAdd: styles.label, classInputAdd: styles.input };

  return (
    <form
      onSubmit={props.handleSubmit}
      className={props.currentUser ? styles.form_logout : styles.form_login}
    >
      {props.currentUser ? (
        <>
          <h1 data-cy="logout-form-title">Вы вошли как [{`${props.currentUser.name}`}]</h1>
          {props.currentUser.role_id!==null && <p>Ваша роль: {RoleNames[props.currentUser.role_id]}</p>}
          <ButtonUI data-cy="logout-form-button" logicType="alert" caption="Выйти" />
        </>
      ) : (
        <>
          <h1 data-cy="login-form-title">Вход в систему</h1>
          <section className={styles.form__content}>
            <InputEditUI
              name="name"
              classes={classes}
              label="Никнэйм:"
              value={props.values.name}
              onChange={props.handleChange}
              dataCy="login-form-name"
            />
            <InputEditUI
              name="password"
              classes={classes}
              type="password"
              label="Пароль:"
              value={props.values.password}
              onChange={props.handleChange}
              dataCy="login-form-password"
            />
          </section>
          <ButtonUI data-cy="login-form-button" logicType="agree" caption="Войти" />
          <section>
            Вы еще не зарегестрированы в системе?
            <br />
            Зарегестрируйтесь через наш{" "}
            <Link to="https://t.me/Sferatum_bot" data-cy="register-link">телеграм-бот!</Link>
          </section>
        </>
      )}
    </form>
  );
};

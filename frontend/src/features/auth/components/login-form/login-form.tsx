import { FC, SyntheticEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { UserInner, User } from "../../user-types";
import { InputEditUI } from "../../../../shared/ui/fields/input-edit/input-edit";
import { AuthStatus } from "../../store/AuthSlice";
import { Preloader } from "../../../../shared/ui/Preloader";
import { ErrorMessageUI } from "../../../../shared/ui/ErrorMessage/ErrorMessage";
import { ButtonUI } from "../../../../shared/ui/button";
import styles from "./login-form.module.css";
import { HTMLEditElement } from "../../../../shared/common-types";

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
          <h1>Вы вошли как [{`${props.currentUser.name}`}]</h1>
          <ButtonUI logicType="alert" caption="Выйти" />
        </>
      ) : (
        <>
          <h1>Вход в систему</h1>
          <section className={styles.form__content}>
            <InputEditUI
              name="name"
              classes={classes}
              label="Никнэйм:"
              value={props.values.name}
              onChange={props.handleChange}
            />
            <InputEditUI
              name="password"
              classes={classes}
              type="password"
              label="Пароль:"
              value={props.values.password}
              onChange={props.handleChange}
            />
          </section>
          <ButtonUI logicType="agree" caption="Войти" />
          <section>
            Вы еще не зарегестрированы в системе?
            <br />
            Зарегестрируйтесь через наш{" "}
            <Link to="https://t.me/Sferatum_bot">телеграм-бот!</Link>
          </section>
        </>
      )}
    </form>
  );
};

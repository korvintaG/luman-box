import { FC, SyntheticEvent,  ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import {HTMLEditElement, UserInner, User} from '../../../../utils/type'
import { InputEditUI } from '../../../../components/ui/uni/input-edit/input-edit'
import {AuthStatus} from '../../../../slices/auth/index'
import { Preloader } from '../preloader';
import { ErrorMessageUI } from '../error-message/error-message'
import { ButtonAgreeUI } from '../button-type-agree/button-type-agree'
import { ButtonAlertUI } from '../button-type-alert/button-type-alert'
import styles from './login-form.module.css';

export type LoginFormProps = {
    values: UserInner; // поля 
    currentUser: User | null;
	status: AuthStatus;
	error: string;
	resetError:(e:SyntheticEvent) => void;
    handleSubmit: (e:SyntheticEvent<HTMLFormElement>)=>void;
    handleChange: (event: React.ChangeEvent<HTMLEditElement>) => void
}

export const LoginForm: FC<LoginFormProps> = (props:LoginFormProps) => {
	if (props.status===AuthStatus.Requesting)
		return <Preloader/>;

    if (props.status===AuthStatus.FailedLogin)
		return <ErrorMessageUI 
			errorTitle="Ошибка авторизации"
			error={props.error}
			okCaption="Вернуться"
			okAction={props.resetError}
			/>

    return <form onSubmit={props.handleSubmit} 
				className={props.currentUser?styles.form_logout:styles.form_login} >
				{props.currentUser?
				<>
					<h1>Вы вошли как [{`${props.currentUser.name}`}]</h1>
					<ButtonAlertUI caption="Выйти"/>
				</>
				:
				<>
					<h1>Вход в систему</h1>
					<section className={styles.login_inputs}>
						<InputEditUI name="name" label='Никнэйм' value={props.values.name} handleChange={props.handleChange}/>
						<InputEditUI name="password" isPassword label='Пароль' value={props.values.password} handleChange={props.handleChange}/>
					</section>
					<ButtonAgreeUI caption="Войти"/>
					<section>Вы еще не зарегестрированы в системе?<br/>
					 Зарегестрируйтесь через наш <Link to ='https://t.me/Sferatum_bot'  >телеграм-бот!</Link></section>
				</>
				}
			</form>
}


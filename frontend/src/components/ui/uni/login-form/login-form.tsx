import { FC, SyntheticEvent,  ChangeEvent } from 'react';
import {HTMLEditElement, UserInner, User} from '../../../../utils/type'
import { InputEditUI } from '../../../../components/ui/uni/input-edit/input-edit'
import {AuthStatus} from '../../../../slices/auth/index'
import { Preloader } from '../preloader';
import { ErrorMessageUI } from '../error-message/error-message'

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

    return (
		<div >
			<form onSubmit={props.handleSubmit} >
				{props.currentUser?
				<>
					<h1>Пользователь {`${props.currentUser.name}`}</h1>
					<button type="submit">Выйти</button>
				</>
				:
				<>
					<h1>Вход в систему</h1>
					<InputEditUI name="name" label='Никнэйм' value={props.values.name} handleChange={props.handleChange}/>
					<InputEditUI name="password" label='Пароль' value={props.values.password} handleChange={props.handleChange}/>
					<button type="submit">Войти</button>
				</>
				}
			</form>
		</div>)

}


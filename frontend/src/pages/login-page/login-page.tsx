import { SyntheticEvent, useEffect } from 'react';
import { useForm } from "../../hooks/useForm";
import { useSelector, useDispatch } from '../../services/store';
import { setStatus, login, logout, selectSliceStatus, selectCurrentUser,  
	resetStatus, selectError,
	selectCurrentLogin, AuthStatus} from '../../slices/auth'
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '../../AppRoutes';
import {LoginForm} from '../../components/ui/uni/login-form/login-form'
import {UserInner} from '../../utils/type'

const emptyUser:UserInner={
	name: "", password: ""
}
 
export default function LoginPage() {
    const { values, handleChange, setValues, getFormDTOObl } = useForm<UserInner>(emptyUser);

	const navigate = useNavigate();  
	const dispatch = useDispatch();
	const sliceStatus = useSelector(selectSliceStatus);
	const currentUser = useSelector(selectCurrentUser);
	const currentLogin = useSelector(selectCurrentLogin);
	const error=useSelector(selectError);

	const resetError=(e:SyntheticEvent) => {
		e.preventDefault();
		dispatch(resetStatus());		
	}

	const handleSubmit = (e:SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (currentUser) {
			dispatch(logout());		
		}
		else
			dispatch(login({...getFormDTOObl()}));
	}

    useEffect(() => {
        if (sliceStatus===AuthStatus.Success) {
			if (currentLogin) {
				setValues(emptyUser) // сброс логина-пароля на странице логина
				dispatch(setStatus(AuthStatus.Idle))
            	navigate(appRoutes.home);       
			}
		}     
    }, [sliceStatus,currentUser]); 

	return <LoginForm
    	values={values}
		status={sliceStatus}
		resetError={resetError}
		error={error}
    	currentUser={currentUser}
    	handleSubmit={handleSubmit}
    	handleChange={handleChange}/>
}

import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeywordDetailsUI } from '../ui/keyword-details/keyword-details'
import {Preloader} from '../ui/preloader';
import { useSelector, useDispatch } from '../../services/store';
import {
    setKeyword,selectCurrentKeyword, delKeyword, selectError,
    selectIsDataLoading, getKeyword, addKeyword
  } from '../../slices/keywords';


export const KeywordDetails = () => {
    const location = useLocation();
    const { id } = useParams();
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const error = useSelector(selectError);
    const currentKeyword = useSelector(selectCurrentKeyword);
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            const idNumber = Number(id);
            dispatch(getKeyword(idNumber))
        }
    },[]);

    useEffect(() => {
        if (currentKeyword)
            setName(currentKeyword.name)
    },[currentKeyword]);

    
    const deleteKeyword = (e: SyntheticEvent) => {
        e.preventDefault();
        const confirmBox = window.confirm(
            `Удалить ключевое слово [${name}]?`
          )
          if (confirmBox === true) {
            const idNumber = Number(id);
            dispatch(delKeyword(idNumber))
            .unwrap()
            .then(() =>navigate('/keywords'))
            .catch(()=>{});        
          }
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id) {
            const idNumber = Number(id);
            dispatch(setKeyword({id: idNumber, name:name})).then(()=> {
                navigate('/keywords');
            })
        }
        else {
            dispatch(addKeyword(name));
            navigate('/keywords');
        }
    }
   return isLoading? <Preloader/> :
        <KeywordDetailsUI id={id?Number(id):null } name={name}
        initialName={currentKeyword? currentKeyword.name: ''}
         error={error} setName={setName}
         handleSubmit={handleSubmit} deleteKeyword={deleteKeyword}/>
}

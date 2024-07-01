import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { useEffect, useState, SyntheticEvent } from 'react';
import { getAuthor, setAuthor} from '../../utils/luman-emu-api'
import { useNavigate } from 'react-router-dom';

export const AuthorDetails = () => {
    const location = useLocation();
    const { id } = useParams();
    const idNumber = Number(id);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getAuthor(idNumber).then((au) => setName(au.name))
    },[]);
    
    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
    
        setAuthor(idNumber,name).then(()=> {
            navigate('/authors');
        })
      };
    

    return <form onSubmit={handleSubmit}><label htmlFor="name">ФИО автора:</label><input value={name} name="name" 
    onChange={(e) => setName(e.target.value)}
    ></input><button >Сохранить данные</button></form>
}

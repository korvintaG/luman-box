import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { useEffect, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SourceDetailsUI } from '../ui/source-details/source-details'
import {Preloader} from '../ui/preloader';
import { useSelector, useDispatch } from '../../services/store';
import {
    setSource,selectCurrentSource, delSource, selectError,
    selectIsDataLoading, getSource, addSource
  } from '../../slices/sources';
import {
    selectAuthors,
    fetchAuthors,
    selectIsDataLoading as aLoading
  } from '../../slices/authors';
import { SourceEditData} from '../../utils/type'
import {useForm} from '../../hooks/useForm';


export const SourceDetails = () => {
    const location = useLocation();
    const { id } = useParams();
    const { values, handleChange, setValues } = useForm<SourceEditData>({
        name: '',
        author_id: 0
      });
    
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const isALoading = useSelector(aLoading);
    const currentSource = useSelector(selectCurrentSource);
    const authors= useSelector(selectAuthors);
    const error = useSelector(selectError);
    const dispatch = useDispatch();

    useEffect(() => {
        if (authors.length===0)
            dispatch(fetchAuthors());
        if (id) {
            const idNumber = Number(id);
            dispatch(getSource(idNumber))
        }
    },[]);

    useEffect(() => {
        if (currentSource)
            setValues({name: currentSource.name, author_id: currentSource.author_id})
    },[currentSource]);

    
    const deleteSource = (e: SyntheticEvent) => {
        e.preventDefault();
        const confirmBox = window.confirm(
            `Удалить источник [${values.name}]?`
          )
          if (confirmBox === true) {
            const idNumber = Number(id);
            dispatch(delSource(idNumber))
            .unwrap()
            .then(() => navigate('/sources'))
            .catch(() => { });
          }
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id) {
            const idNumber = Number(id);
            //console.log('handleSubmit',values);
            dispatch(setSource({id: idNumber, author_id: Number(values.author_id), name:values.name})).
            then(()=> {
                navigate('/sources');
            })
        }
        else {
            dispatch(addSource(values));
            navigate('/sources');
        }
    }
   return (isLoading || isALoading)? <Preloader/> :
        <SourceDetailsUI id={id?Number(id):null } values={values} 
        initialName={currentSource? currentSource.name+' // '+currentSource.authorName:''}
        error={error}
        handleChange={handleChange}
        handleSubmit={handleSubmit} deleteSource={deleteSource} authors={authors}/>
}

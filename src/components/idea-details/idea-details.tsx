import { useLocation } from 'react-router';
import { useParams } from 'react-router';
import { useEffect, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { IdeaDetailsUI } from '../ui/idea-details/idea-details'
import {Preloader} from '../ui/preloader';
import { useSelector, useDispatch } from '../../services/store';
import {
    setIdea,selectCurrentIdea, delIdea,
    selectIsDataLoading, getIdea, addIdea
  } from '../../slices/ideas';
import {
    selectSources,
    fetchSources,
    selectIsDataLoading as sLoading
  } from '../../slices/sources';
  import {
    selectKeywords,
    fetchKeywords,
    selectIsDataLoading as kLoading
  } from '../../slices/keywords';
import { IdeaEditData} from '../../utils/type'
import {useForm} from '../../hooks/useForm';


export const IdeaDetails = () => {
    const location = useLocation();
    const { id } = useParams();
    const { values, handleChange, setValues } = useForm<IdeaEditData>({
        name: '',
        source_id: 0,
        original_text: '',
        content: '',
        date_time_create: '',
        keywords:[]
      });
    
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsDataLoading);
    const isSLoading = useSelector(sLoading);
    const currentIdea = useSelector(selectCurrentIdea);
    const sources= useSelector(selectSources);
    const isKLoading = useSelector(kLoading);
    const keywords= useSelector(selectKeywords);
    const dispatch = useDispatch();

    useEffect(() => {
        if (sources.length===0)
            dispatch(fetchSources());
        if (keywords.length===0)
            dispatch(fetchKeywords());
        if (id) {
            const idNumber = Number(id);
            dispatch(getIdea(idNumber))
        }
    },[]);

    useEffect(() => {
        if (currentIdea)
            setValues({...currentIdea, source_id: Number(currentIdea.source_id)})
    },[currentIdea]);

    
    const deleteIdea = (e: SyntheticEvent) => {
        e.preventDefault();
        const confirmBox = window.confirm(
            `Удалить идею [${values.name}]?`
          )
          if (confirmBox === true) {
            const idNumber = Number(id);
            dispatch(delIdea(idNumber));
            navigate('/sources');        
          }
    }

    const deleteKeyword = (e: SyntheticEvent, id: number) => {
        e.preventDefault();
        setValues({...values,keywords:values.keywords!.filter((el)=>el!=id)})
    }

    const addKeyword = (id: number) => {
        setValues({...values,keywords:[...values.keywords!, id]})
    }


    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (id) {
            const idNumber = Number(id);
            dispatch(setIdea({...values, id: idNumber, source_id: Number(values.source_id)})).
            then(()=> {
                navigate('/ideas');
            })
        }
        else {
            dispatch(addIdea(values));
            navigate('/ideas');
        }
    }

   return (isLoading || isSLoading || isKLoading)? <Preloader/> :
        <IdeaDetailsUI id={id?Number(id):null } values={values} handleChange={handleChange}
         handleSubmit={handleSubmit} deleteIdea={deleteIdea} sources={sources} keywords={keywords}
         addKeyword={addKeyword} deleteKeyword={deleteKeyword}
         initialName={currentIdea? currentIdea.name : ''}/>
}

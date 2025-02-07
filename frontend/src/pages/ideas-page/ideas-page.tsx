import { FC, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { appRoutes} from '../../AppRoutes'
import { useSelector, useDispatch } from '../../services/store';
import {
    selectIdeas,
    fetchIdeas,
    fetchIdeasBySrcKw,
    selectIsDataLoading,
    clearCurrentIdea
  } from '../../slices/ideas';
import { IdeaListUI } from '../../components/ui/list/idea-list'
import { selectCurrentUser } from '../../slices/auth';


/**
 * Страница список идей
 */
export const IdeasPage: FC = () => {
    const ideas = useSelector(selectIdeas);
    const isLoading = useSelector(selectIsDataLoading);
    const currentUser=useSelector(selectCurrentUser)
    const [searchParams] = useSearchParams();
    const condSrc = searchParams.get('source_id');
    const condKw = searchParams.get('keyword_id');
    console.log('IdeasPage',condSrc,condKw);

  
    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    useEffect(() => {
        if (condSrc && condKw) {
            console.log('IdeasPage useEffect condSrc')
            dispatch(fetchIdeasBySrcKw({source_id:Number(condSrc), keyword_id:Number(condKw)}))
        }
        else {
            console.log('IdeasPage useEffect null')
            dispatch(fetchIdeas())
        }
    }, []);

    const addNewIdea = () => {
        dispatch(clearCurrentIdea());
        navigate(appRoutes.ideaAdd)
    }

    return <IdeaListUI
        ideas={ideas}
        readOnly={!currentUser}
        addNewIdea={addNewIdea}
        isLoading={isLoading}
    />
};

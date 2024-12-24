import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appRoutes} from '../../AppRoutes'
import { useSelector, useDispatch } from '../../services/store';
import {
    selectSources,
    fetchSources,
    selectIsDataLoading,
    clearCurrentSource
} from '../../slices/sources';
import {SourceListUI} from '../../components/ui/list/source-list';

/**
 * Страница список источников
 */
export const SourcesPage: FC = () => {
    const sources = useSelector(selectSources);
    const isLoading = useSelector(selectIsDataLoading);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchSources())
    }, []);

    const addNewSource = () => {
        dispatch(clearCurrentSource());
        navigate(appRoutes.sourceAdd)
    }

    return <SourceListUI 
                sources={sources} 
                isLoading={isLoading} 
                addNewSource={addNewSource}/>
};

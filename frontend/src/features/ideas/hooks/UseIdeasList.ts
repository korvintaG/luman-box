import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "../../../shared/services/store";
import { clearCurrentIdea, fetchIdeas, fetchIdeasBySrcKw, selectError, selectIdeas, selectSliceState } from "../store/IdeaSlice";

export type useIdeasListProps = {
    gotoIdeaAdd:()=>void,
    condSrc?:string | null;
    condKw?:string | null;
}

export const useIdeasList =({gotoIdeaAdd, condSrc, condKw}:useIdeasListProps)=>{
    const dispatch = useDispatch(); 
    const ideas = useSelector(selectIdeas);
    const sliceState = useSelector(selectSliceState);
   const error= useSelector(selectError)

   const fetchRecords = ()=>{
    if (condSrc && condKw) {
        dispatch(
            fetchIdeasBySrcKw({
            source_id: Number(condSrc),
            keyword_id: Number(condKw),
            }),
        );
        } else {
            dispatch(fetchIdeas());
        }
  }
 

    useEffect(() => {
        fetchRecords();
    }, []);

  const addNewIdea = () => {
    dispatch(clearCurrentIdea());
    gotoIdeaAdd();
  }

  return {ideas, sliceState, addNewIdea, fetchRecords, error};

}

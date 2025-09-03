import { generatePath } from "react-router-dom";
import { InterconnectionList } from '../types/query-types';
import { InterconnectionsParamsType } from '../types/request-types';
import { InterconnectionAdd, InterconnectionDetail } from '../types/entity-types';
import { InterconnectionUpdateForm } from '../types/UI-types';
import { EntityAPI, IEntityAPI } from '../../../shared/api/entity-api';

export interface IInterconnectionAPI extends IEntityAPI<
  InterconnectionAdd, InterconnectionDetail, 
  InterconnectionUpdateForm, InterconnectionDetail,
  InterconnectionsParamsType, InterconnectionList> {
  
}

export class InterconnectionAPI extends EntityAPI<
  InterconnectionAdd, InterconnectionDetail, 
  InterconnectionUpdateForm, InterconnectionDetail,
  InterconnectionsParamsType, InterconnectionList> 
  implements IInterconnectionAPI {

  constructor() {
    super("interconnections");
  }

  protected getQueryListString = (params: InterconnectionsParamsType): string => {
    const route=generatePath('/by-idea-and-type/:id/:tid',{
      id:String(params.idea_id),
      tid:String(params.iitype_id)
    });
    
    console.log("queryParams interconnection class", route);
    return route;
  };

}

const interconnectionAPI=new InterconnectionAPI();
export default interconnectionAPI;

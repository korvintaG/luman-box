import { KeywordDetail, 
  KeywordDetailPartial, 
  KeywordAdd, 
  KeywordList, 
  KeywordListParam, 
  KeywordSummary,
  KeywordSearchToken,
  KeywordSearchResult} from '../types/keyword-types'
import { EntityAPI, IEntityAPI } from '../../../shared/api/entity-api';
import { getCookie } from '../../../shared/utils/cookie';
import { SimpleNameObject } from '../../../shared/types/entity-types';

export interface IKeywordAPI extends IEntityAPI<
  KeywordAdd, 
  KeywordDetailPartial, 
  KeywordDetail,
  KeywordListParam, 
  KeywordList> {
}

export class KeywordAPI extends EntityAPI<
  KeywordAdd, 
  KeywordDetailPartial, 
  KeywordDetail,
  KeywordListParam, 
  KeywordList> 
  implements IKeywordAPI {

  constructor() {
    super("keywords");
  }

  /*getEntitiesByClass = (class_id?: number): Promise<KeywordsByClass> => {
    return this.requestWithRefresh<KeywordsByClass>(`/${this.entity}/by-class/${class_id?class_id:0}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };*/

  getEntitySummary = (id: number): Promise<KeywordSummary>=> {
    return this.requestWithRefresh<KeywordSummary>(`/${this.entity}/${id}/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });
  };

  searchEntity = (req: KeywordSearchToken) : Promise<KeywordSearchResult[]> => {
    return this.requestWithRefresh<KeywordSearchResult[]>
      (`/${this.entity}/search`, {
      method: "POST",
      body: JSON.stringify({ ...req }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
    });

  }

}



const keywordAPI=new KeywordAPI();
export default keywordAPI;

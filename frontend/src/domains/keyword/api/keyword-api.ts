import { KeywordDetail, KeywordDetailPartial, KeywordPlain, KeywordAdd, KeywordList } from '../types/KeywordTypes'
import { EntityAPI, IEntityAPI } from '../../../shared/api/entity-api';

export interface IKeywordAPI extends IEntityAPI<
  KeywordAdd, 
  KeywordPlain, 
  KeywordDetailPartial, 
  KeywordDetail,
  undefined, KeywordList[]> {
}

export class KeywordAPI extends EntityAPI<
  KeywordAdd, KeywordPlain, 
  KeywordDetailPartial, KeywordDetail,
  undefined, KeywordList[]> 
  implements IKeywordAPI {

  constructor() {
    super("keywords");
  }

}



const keywordAPI=new KeywordAPI();
export default keywordAPI;

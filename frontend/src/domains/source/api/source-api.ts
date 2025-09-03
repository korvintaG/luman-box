import { SourceDetailPartial, SourceDetail, SourcePlain, SourceAdd, SourceList} from '../types/source-type'
import { EntityAPI, IEntityAPI } from '../../../shared/api/entity-api';

export interface ISourceAPI extends IEntityAPI<
  SourceAdd, SourcePlain, 
  SourceDetailPartial, SourceDetail,
  undefined, SourceList[]> {
}

export class SourceAPI extends EntityAPI<
  SourceAdd, SourcePlain, 
  SourceDetailPartial, SourceDetail,
  undefined, SourceList[]> 
  implements ISourceAPI {

  constructor() {
    super("sources");
  }

}

const sourceAPI=new SourceAPI();
export default sourceAPI;

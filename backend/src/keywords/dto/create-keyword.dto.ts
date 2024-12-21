import { IKeyword } from '../../types/custom';

export class CreateKeywordDto {
    constructor(
        public id_out: string,
        public name: string
      ) {}
    
      static from = (authorDocument: IKeyword): CreateKeywordDto =>
        new CreateKeywordDto(
          authorDocument.id_out,
          authorDocument.name
        );
}

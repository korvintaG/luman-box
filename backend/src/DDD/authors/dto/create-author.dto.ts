import { IAuthor } from '../../../types/custom';

export class CreateAuthorDto {
    constructor(
        public id_out: string,
        public name: string
      ) {}
    
      static from = (authorDocument: IAuthor): CreateAuthorDto =>
        new CreateAuthorDto(
          authorDocument.id_out,
          authorDocument.name
        );
}

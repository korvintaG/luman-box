import { ISource } from '../../types/custom'

export class CreateSourceDto {
    constructor(
        public id_out: string,
        public name: string,
        public author_id: number
      ) {}
    
      static from = (sourceDocument: ISource): CreateSourceDto =>
        new CreateSourceDto(
            sourceDocument.id_out,
            sourceDocument.name,
            sourceDocument.author_id
        );
}

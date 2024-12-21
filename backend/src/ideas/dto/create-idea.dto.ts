import { IIdea } from '../../types/custom';
export class CreateIdeaDto {
    constructor(
        public id_out: string,
        public name: string,
        public source_id: number,
        public original_text: string,
        public content: string,
        public date_time_create: string,
        public keywords: number[]
      ) {}
    
      static from = (ideaDocument: IIdea): CreateIdeaDto =>
        new CreateIdeaDto(
            ideaDocument.id_out,
            ideaDocument.name,
            ideaDocument.source_id,
            ideaDocument.original_text,
            ideaDocument.content,
            ideaDocument.date_time_create,
            ideaDocument.keywords
        );
}

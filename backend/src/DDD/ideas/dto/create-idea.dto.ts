import { IIdea } from '../../../types/custom';
export class CreateIdeaDto {
    constructor(
        public id_out: string,
        public name: string,
        public source: {id: number},
        public original_text: string,
        public content: string,
        public keywords: {id:number}[]
      ) {}
    
      static from = (ideaDocument: IIdea): CreateIdeaDto =>
        new CreateIdeaDto(
            ideaDocument.id_out,
            ideaDocument.name,
            {id: ideaDocument.source_id},
            ideaDocument.original_text,
            ideaDocument.content,
            ideaDocument.keywords.map((el)=>{return {id:el}})
        );
}

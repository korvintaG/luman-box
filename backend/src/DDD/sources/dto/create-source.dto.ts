import { ISource } from '../../../types/custom'
import {
  IsString,
  IsInt,
  IsNotEmpty,
  Length,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';


export class CreateSourceAuthorDto {
  @IsNotEmpty({ message: 'Поле ID Автора не может быть пустым' })
  @IsInt({ message: 'Поле ID Автора должно быть целым числом' })
  id: number
}

export class CreateSourceDto {
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({message: 'Поле [name] должно быть строкой'})
  @Length(5, 400, {message: 'Название источника должно быть от 5-ти до 400 символов длиной'})
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSourceAuthorDto)
  author?: CreateSourceAuthorDto
}


/*export class CreateSourceDto {
    constructor(
        public id_out: string,
        public name: string,
        public author: {id: number}
      ) {}
    
      static from = (sourceDocument: ISource): CreateSourceDto =>
        new CreateSourceDto(
            sourceDocument.id_out,
            sourceDocument.name,
            {id:sourceDocument.author_id}
        );
}
*/
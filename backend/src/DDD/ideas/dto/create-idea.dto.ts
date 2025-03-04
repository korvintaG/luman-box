import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

export class CreateIdeaSourceDto {
  @IsNotEmpty({ message: 'Поле ID источника не может быть пустым' })
  @IsInt({ message: 'Поле ID источника должно быть целым числом' })
  @Min(1, { message: 'Поле ID источника должно быть больше нуля' })
  id: number;
}

export class CreateIdeaKeywordDto {
  @IsNotEmpty({ message: 'Поле ID ключевого слова не может быть пустым' })
  @IsInt({ message: 'Поле ID ключевого слова должно быть целым числом' })
  @Min(1, { message: 'Поле ID ключевого слова должно быть больше нуля' })
  id: number;
}

export class CreateIdeaUserDto {
  @IsNotEmpty({ message: 'Поле ID пользователя не может быть пустым' })
  @IsInt({ message: 'Поле ID пользователя должно быть целым числом' })
  @Min(1, { message: 'Поле ID пользователя должно быть больше нуля' })
  id: number;
}

export class CreateIdeaDto {
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  @Length(5, 250, {
    message: 'Название идеи должно быть от 5-ти до 250 символов длиной',
  })
  name: string;

  @IsNotEmpty({ message: 'Поле [original_text] не может быть пустым' })
  @IsString({ message: 'Поле [original_text] должно быть строкой' })
  @Length(10, 8000, {
    message: 'Исходная цитата должна быть от 10-ти до 8000 символов длиной',
  })
  original_text: string;

  @IsNotEmpty({ message: 'Поле $property не может быть пустым' })
  @IsString({ message: 'Поле $property должно быть строкой' })
  @Length(30, 4000, {
    message: 'Идея должна быть от 30-ти до 4000 символов длиной',
  })
  content: string;

  @ValidateNested({ each: true })
  @Type(() => CreateIdeaSourceDto)
  source: CreateIdeaSourceDto;

  @ValidateNested({ each: true })
  @Type(() => CreateIdeaUserDto)
  user: CreateIdeaUserDto;

  @IsArray({ message: 'Поле $property должно быть массивом' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {
    message: 'Для идеи должно быть минимум одно ключевое слово',
  })
  @Type(() => CreateIdeaKeywordDto)
  keywords: CreateIdeaKeywordDto[];
}

/*export class CreateIdeaDto {
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
}*/

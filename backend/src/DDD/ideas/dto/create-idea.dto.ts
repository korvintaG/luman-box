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
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIdeaSourceDto {
  @ApiProperty({
    description: 'ID источника',
    example: 1,
  })
  @IsNotEmpty({ message: 'Поле ID источника не может быть пустым' })
  @IsInt({ message: 'Поле ID источника должно быть целым числом' })
  @Min(1, { message: 'Поле ID источника должно быть больше нуля' })
  id: number;
}

export class CreateIdeaKeywordNameDto {
  @ApiProperty({
    description: 'ID ключевого слова',
    example: 1,
  })
  @IsNotEmpty({ message: 'Поле ID имени ключевого слова не может быть пустым' })
  @IsInt({ message: 'Поле ID имени ключевого слова должно быть целым числом' })
  @Min(1, { message: 'Поле ID имени ключевого слова должно быть больше нуля' })
  id: number;
}

export class CreateIdeaUserDto {
  @ApiProperty({
    description: 'ID пользователя, создающего идею',
    example: 1,
  })
  @IsNotEmpty({ message: 'Поле ID пользователя не может быть пустым' })
  @IsInt({ message: 'Поле ID пользователя должно быть целым числом' })
  @Min(1, { message: 'Поле ID пользователя должно быть больше нуля' })
  id: number;
}

export class CreateIdeaDto {
  @ApiProperty({
    description: 'Название идеи',
    example: 'Важность систематического подхода',
  })
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  @Length(5, 250, {
    message: 'Название идеи должно быть от 5-ти до 250 символов длиной',
  })
  name: string;

  @ApiProperty({
    description: 'Исходная цитата',
    example: 'Систематический подход к решению задач позволяет достигать лучших результатов.',
  })
  @IsNotEmpty({ message: 'Поле [original_text] не может быть пустым' })
  @IsString({ message: 'Поле [original_text] должно быть строкой' })
  @Length(10, 8000, {
    message: 'Исходная цитата должна быть от 10-ти до 8000 символов длиной',
  })
  original_text: string;

  @ApiPropertyOptional({
    description: 'SVG изображение',
    example: '<svg>...</svg>',
  })
  @IsOptional()
  @IsString({ message: 'Поле [SVG] должно быть строкой' })
  @Length(0, 14000, {
    message: 'SVG должен быть длиной от 0 до 14000 символов',
  })
  SVG: string;

  @ApiProperty({
    description: 'Содержание идеи',
    example: 'Систематический подход к решению задач позволяет достигать лучших результатов, так как обеспечивает структурированность и последовательность действий.',
  })
  @IsNotEmpty({ message: 'Поле $property не может быть пустым' })
  @IsString({ message: 'Поле $property должно быть строкой' })
  @Length(30, 4000, {
    message: 'Идея должна быть от 30-ти до 4000 символов длиной',
  })
  content: string;

  @ApiProperty({
    description: 'Источник идеи',
    type: CreateIdeaSourceDto,
    example: { id: 1 },
  })
  @ValidateNested({ each: true })
  @Type(() => CreateIdeaSourceDto)
  source: CreateIdeaSourceDto;

  @ApiProperty({
    description: 'Ключевые слова идеи',
    type: CreateIdeaKeywordNameDto,
    isArray: true,
    example: [{ id: 1 }, { id: 2 }],
  })
  @IsArray({ message: 'Поле $property должно быть массивом' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {
    message: 'Для идеи должно быть минимум одно ключевое слово',
  })
  @Type(() => CreateIdeaKeywordNameDto)
  keyword_names: CreateIdeaKeywordNameDto[];
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

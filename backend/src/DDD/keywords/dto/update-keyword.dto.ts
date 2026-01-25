import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateKeywordNameDto {
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  name: string;

  @IsOptional()
  @IsInt({ message: 'Поле [id] должно быть целым числом' })
  id: number;
}

export class UpdateKeywordDto {

    @IsOptional({ message: 'Поле [names] не может быть пустым' })
    @IsArray({ message: 'Поле [names] должно быть массивом' })
    @ArrayMinSize(1, {
        message: 'Для ключевого слова должно быть минимум одно название',
    })
    @ValidateNested({ each: true })
    @Type(() => UpdateKeywordNameDto)
    names: UpdateKeywordNameDto[];

    @IsOptional({ message: 'Поле [default_name_index] не может быть пустым' })
    @IsInt({ message: 'Поле [default_name_index] должно быть целым числом' })
    @Min(0, { message: 'Поле [default_name_index] должно быть больше или равно нулю' })
    default_name_index: number;

    @IsOptional()
    @IsString({ message: 'Поле [definition] должно быть строкой' })
    @Length(0, 1000, {
        message: 'definition должен быть длиной от 0 до 1000 символов',
    })definition: string;


}

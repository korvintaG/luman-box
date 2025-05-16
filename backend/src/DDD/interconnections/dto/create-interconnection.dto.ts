import {
    Max,
    IsInt,
    IsString,
    MinLength,
    MaxLength,
    Min,
    IsBoolean,
  } from 'class-validator';
  
export class InterconnectionEntityDto {
  @IsInt({ message: 'Поле [interconnection_type] должно быть целым числом' })
  @Min(1, { message: 'Поле [interconnection_type] должно быть больше нуля' })
  @Max(30, { message: 'Поле [interconnection_type] должно быть меньше или равно 30' })
  interconnection_type: number;

  @IsInt({ message: 'Поле [idea1_id] должно быть целым числом' })
  @Min(1, { message: 'Поле [idea1_id] должно быть больше нуля' })
  idea1_id: number;

  @IsInt({ message: 'Поле [idea2_id] должно быть целым числом' })
  @Min(1, { message: 'Поле [idea2_id] должно быть больше нуля' })
  idea2_id: number;

  @IsString({ message: 'Поле [name_direct] должно быть строкой' })
  @MinLength(10, { message: 'Поле [name_direct] должно минимум 10 символов длиной' })
  @MaxLength(250, { message: 'Поле [name_direct] может бфть максимум 250 символов длиной' })
  name_direct: string;

  @IsString({ message: 'Поле [name_reverse] должно быть строкой' })
  @MinLength(10, { message: 'Поле [name_reverse] должно минимум 10 символов длиной' })
  @MaxLength(250, { message: 'Поле [name_reverse] может бфть максимум 250 символов длиной' })
  name_reverse: string;
}

/*export class  CreateInterconnectionInput{
        @IsInt({ message: 'Поле [interconnection_type] должно быть целым числом' })
        @Min(1, { message: 'Поле [interconnection_type] должно быть больше нуля' })
        @Max(30, { message: 'Поле [interconnection_type] должно быть меньше или равно 30' })
        interconnection_type: number;

        @IsInt({ message: 'Поле [idea1_id] должно быть целым числом' })
        @Min(1, { message: 'Поле [idea1_id] должно быть больше нуля' })
        idea1_id: number;
      
        @IsInt({ message: 'Поле [idea2_id] должно быть целым числом' })
        @Min(1, { message: 'Поле [idea2_id] должно быть больше нуля' })
        idea2_id: number;

        @IsString({ message: 'Поле [name_direct] должно быть строкой' })
        @MinLength(10, { message: 'Поле [name_direct] должно минимум 10 символов длиной' })
        @MaxLength(250, { message: 'Поле [name_direct] может бфть максимум 250 символов длиной' })
        name_direct: string;
      
        @IsString({ message: 'Поле [name_reverse] должно быть строкой' })
        @MinLength(10, { message: 'Поле [name_reverse] должно минимум 10 символов длиной' })
        @MaxLength(250, { message: 'Поле [name_reverse] может бфть максимум 250 символов длиной' })
        name_reverse: string;

        @IsBoolean({ message: 'Поле [is_reverse] должно быть булевым' })
        is_reverse: boolean;
}*/

/*export class InterconnectonMapper {
  static toEntityDto(input: CreateInterconnectionInput):InterconnectionEntityDto  {
    const entityDto = new InterconnectionEntityDto();
    
    if (input.is_reverse)  {
      entityDto.idea1_id=input.idea_to_interconnect_id;
      entityDto.idea2_id=input.idea_current_id;
      entityDto.name_direct=input.name_reverse
      entityDto.name_reverse=input.name_direct
    }
    else {
      entityDto.idea2_id=input.idea_to_interconnect_id;
      entityDto.idea1_id=input.idea_current_id;
      entityDto.name_direct=input.name_direct
      entityDto.name_reverse=input.name_reverse
      }
    entityDto.interconnection_type=input.interconnection_type;
    
    

    return entityDto;
  }
}*/

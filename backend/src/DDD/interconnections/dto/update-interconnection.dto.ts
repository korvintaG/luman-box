import { PartialType } from '@nestjs/mapped-types';
import { InterconnectionEntityDto } from './create-interconnection.dto';
import {
    Max,
    IsInt,
    IsString,
    MinLength,
    MaxLength,
    Min,
    IsOptional,
  } from 'class-validator';

export class UpdateInterconnectionDto extends PartialType(InterconnectionEntityDto) {
        @IsOptional()
        @IsString({ message: 'Поле [name_direct] должно быть строкой' })
        @MinLength(10, { message: 'Поле [name_direct] должно минимум 10 символов длиной' })
        @MaxLength(250, { message: 'Поле [name_direct] может бфть максимум 250 символов длиной' })
        name_direct: string;
      
        @IsOptional()
        @IsString({ message: 'Поле [name_reverse] должно быть строкой' })
        @MinLength(10, { message: 'Поле [name_reverse] должно минимум 10 символов длиной' })
        @MaxLength(250, { message: 'Поле [name_reverse] может бфть максимум 250 символов длиной' })
        name_reverse: string;
    }

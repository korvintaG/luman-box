import {
    Max,
    IsNotEmpty,
    IsInt,
    Min,
  } from 'class-validator';
  
export class CreateAttitudeDto {
        @IsInt({ message: 'Поле [like] должно быть целым числом' })
        @Min(0, { message: 'Поле [like] должно быть больше или равно нуля' })
        @Max(4, { message: 'Поле [like] должно быть меньше или равно 4' })
        like: number;

        @IsInt({ message: 'Поле [importance] должно быть целым числом' })
        @Min(0, { message: 'Поле [importance] должно быть больше или равно нуля' })
        @Max(4, { message: 'Поле [importance] должно быть меньше или равно 4' })
        importance: number;
      
        @IsInt({ message: 'Поле [truth] должно быть целым числом' })
        @Min(0, { message: 'Поле [truth] должно быть больше или равно нуля' })
        @Max(4, { message: 'Поле [truth] должно быть меньше или равно 4' })
        truth: number;
}

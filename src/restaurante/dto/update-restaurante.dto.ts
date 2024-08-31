import { PartialType } from '@nestjs/mapped-types';
import { CreateRestauranteDto } from './create-restaurante.dto';
import { IsString, MinLength, IsInt, Min, IsDate, ValidateIf } from 'class-validator';

export class UpdateRestauranteDto extends PartialType(CreateRestauranteDto) {
    @IsString({ message: 'El campo nombre debe ser un string' })
    @MinLength(1, { message: 'El campo nombre no debe estar vacío' })
    nombre: string;

    @IsInt({ message: 'El campo estrellas debe ser un número entero' })
    @Min(1, { message: 'El número de estrellas debe ser mayor o igual a 1' })
    estrellas: number;

    @IsDate({ message: 'El campo fechaApertura debe ser una fecha' })
    @ValidateIf(o => o.fechasConsecucionEstrellas <= new Date(), { message: 'La fecha de consecución de estrellas debe ser en el pasado o presente' })
    fechasConsecucionEstrellas: Date;
}

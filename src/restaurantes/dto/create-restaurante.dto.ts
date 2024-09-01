import { IsNumber, IsString, MinLength, IsDate, IsDateString } from "class-validator";
import { Type } from 'class-transformer';

export class CreateRestauranteDto {

    @IsString({ message: 'El campo nombre debe ser un string' })
    @MinLength(1, { message: 'El campo nombre no debe estar vacío' }) 
    nombre: string;

    @IsNumber({}, { message: 'El campo estrellas debe ser un número' }) // Corrected: Added empty options object
    estrellas: number;

    
    @IsDateString()
    fechasConsecucionEstrellas: string;
}


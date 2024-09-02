import { IsNumber, IsString, MinLength, IsDateString } from "class-validator";

export class CreateRestauranteDto {

    @IsString({ message: 'El campo nombre debe ser un string' })
    @MinLength(1, { message: 'El campo nombre no debe estar vacío' }) 
    nombre: string;

    @IsNumber({}, { message: 'El campo estrellas debe ser un número' })
    estrellas: number;

    
    @IsDateString()
    fechasConsecucionEstrellas: string;
}


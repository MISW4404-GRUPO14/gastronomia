import { PartialType } from '@nestjs/mapped-types';
import { CreateCiudadDto } from './create-ciudad.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdateCiudadDto extends PartialType(CreateCiudadDto) {
    // Puedes añadir validaciones adicionales aquí si es necesario.
    @IsString({ message: 'El campo nombre debe ser un string' })
    @MinLength(1, { message: 'El campo nombre no debe estar vacío' }) 
    nombre?: string; // Nota: el campo es opcional debido a PartialType
}

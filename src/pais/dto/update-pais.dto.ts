import { PartialType } from '@nestjs/mapped-types';
import { CreatePaisDto } from './create-pais.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdatePaisDto extends PartialType(CreatePaisDto) {
    @IsString({ message: 'El campo nombre debe ser un string' })
    @MinLength(1, { message: 'El campo nombre no debe estar vacío' }) 
    nombre?: string;

    // Asegúrate de incluir todos los campos opcionales necesarios para la actualización
    // por ejemplo, si hay campos adicionales en PaisEntity que necesitas actualizar.
}

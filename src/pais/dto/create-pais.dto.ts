import { IsString, MinLength } from 'class-validator';

export class CreatePaisDto {
    @IsString({ message: 'El campo nombre debe ser un string' })
    @MinLength(1, { message: 'El campo nombre no debe estar vacío' })
    nombre: string;
}
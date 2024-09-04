import { IsString, MinLength } from 'class-validator';

export class CreateCategoriaDto {
    @IsString({message: 'El campo nombre debe ser un string' })
    @MinLength(1,{message: 'El campo nombre no debe estar vacío'}) 
    public nombre: string;

    @IsString({message: 'El campo nombre debe ser un string' })
    public descripcion: string;
}

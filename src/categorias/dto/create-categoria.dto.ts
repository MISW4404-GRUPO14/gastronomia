import { IsString, MinLength } from 'class-validator';

export class CreateCategoriaDto {

    public id:string;
    @IsString({message: 'El campo nombre debe ser un string' })
    @MinLength(1,{message: 'El campo nombre no debe estar vacío'}) 
    public nombre: string;


    @IsString()
    public descripcion: string;
}

import { IsString, IsUrl, MinLength } from "class-validator";

export class CreateRecetaDto {

    @IsString({message: 'El campo nombre debe ser un string' })
    @MinLength(1,{message: 'El campo nombre no debe estar vacío'}) 
    nombre: string;

    @IsString({message: 'El campo descripción debe ser un string'} )
    @MinLength(1,{message: 'El campo descripción no debe estar vacío'}) 
    descripcion: string;

    @IsUrl()
    foto: string;

    @IsString({message: 'El campo proceso debe ser un texto'})
    @MinLength(5, {message: 'El campo proceso no debe estar vacío'}) 
    proceso: string;

    @IsUrl()
    video: string;

}

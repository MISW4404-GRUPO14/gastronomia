import { IsString, IsUrl, MinLength } from "class-validator";

export class CreateCulturaDto {
    @IsString({message: 'El campo nombre debe ser un string' })
    @MinLength(1,{message: 'El campo nombre no debe estar vacío'}) 
    nombre: string;

    @IsString({message: 'El campo descripcion debe ser un string' })
    @MinLength(1,{message: 'El campo descripcion no debe estar vacío'}) 
    descripcion: string;
}

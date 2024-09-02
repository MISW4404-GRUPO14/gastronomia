import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class AgregarPaisesDto {

    @IsArray()
    @IsUUID('all', { each: true }) 
    paisIds: string[];
}
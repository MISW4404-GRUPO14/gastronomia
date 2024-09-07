import { IsArray, IsUUID } from "class-validator";

export class AgregarRecetasDto {

    @IsArray()
    @IsUUID('all', { each: true }) 
    recetasId: string[];
}
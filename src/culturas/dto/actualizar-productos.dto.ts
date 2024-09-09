import { IsArray, IsUUID } from "class-validator";

export class ActualizarProductosDto {

    @IsArray()
    @IsUUID('all', { each: true }) 
    productosIds: string[];
}
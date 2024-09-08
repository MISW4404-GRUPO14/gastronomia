import { IsUUID } from "class-validator";

export class EliminarCulturaDto {
    @IsUUID()
    restauranteId: string;
    
    @IsUUID()
    culturaId: string;
}
import { IsArray, IsUUID } from "class-validator";

export class AgregarPaisesDto {

    @IsArray()
    @IsUUID('all', { each: true }) 
    paisesIds: string[];
}
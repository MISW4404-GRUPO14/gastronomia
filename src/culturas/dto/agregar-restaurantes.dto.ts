import { IsArray, IsUUID } from "class-validator";

export class AgregarRestaurantesDto {

    @IsArray()
    @IsUUID('all', { each: true }) 
    restaurantesIds: string[];
}
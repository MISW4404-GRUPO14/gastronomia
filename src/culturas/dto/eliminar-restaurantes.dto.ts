import { IsUUID } from 'class-validator';

export class EliminarRestauranteDto {
  @IsUUID()
  culturaId: string;

  @IsUUID()
  restauranteId: string;
}
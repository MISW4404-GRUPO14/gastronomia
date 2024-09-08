import { IsUUID } from 'class-validator';

export class EliminarRecetaDto {
  @IsUUID()
  culturaId: string;

  @IsUUID()
  recetaId: string;
}
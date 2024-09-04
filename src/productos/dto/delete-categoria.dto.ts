import { IsUUID } from "class-validator";

export class EliminarCategoriaDto {
    @IsUUID()
    categoriaId: string;
  
    @IsUUID()
    productoId: string;
  }
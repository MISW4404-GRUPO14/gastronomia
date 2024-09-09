import { IsUUID } from "class-validator";

export class CreateCategoriaDto {
    @IsUUID()
    categoriaId: string;
}

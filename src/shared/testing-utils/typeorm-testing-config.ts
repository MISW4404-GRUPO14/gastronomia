import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { Receta } from '../../recetas/entities/receta.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [Categoria, Producto,Receta],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([Categoria, Producto,Receta]),
];
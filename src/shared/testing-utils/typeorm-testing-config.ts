import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Producto } from '../../productos/entities/producto.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [Categoria, Producto],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([Categoria, Producto]),
];
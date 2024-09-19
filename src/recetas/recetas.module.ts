import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cultura } from '../culturas/entities/cultura.entity';

@Module({
  controllers: [RecetasController],
  providers: [RecetasService],
  imports: [
    TypeOrmModule.forFeature([ Receta, Producto, Cultura ]),
    CacheModule.register()
  ]
})
export class RecetasModule {}

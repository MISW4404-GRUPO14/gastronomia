import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturasService } from './culturas.service';
import { CulturasController } from './culturas.controller';
import { Cultura } from './entities/cultura.entity';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { Pais } from '../paises/entities/pais.entity';
import { Receta } from '../recetas/entities/receta.entity';


@Module({
  controllers: [CulturasController],
  providers: [CulturasService],
  imports: [
    TypeOrmModule.forFeature([ Cultura, Restaurante, Pais, Receta])
  ]
})
export class CulturasModule {}

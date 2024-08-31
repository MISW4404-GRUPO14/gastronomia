import { Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteController } from './restaurante.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './entities/restaurante.entity';
import { CiudadEntity } from '../ciudad/entities/ciudad.entity';
import { Cultura } from '../culturas/entities/cultura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity, CiudadEntity, Cultura])],
  providers: [RestauranteService],
  controllers: [RestauranteController]
})
export class RestauranteModule {}

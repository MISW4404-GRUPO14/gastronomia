import { Module } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { CiudadEntity } from './entities/ciudad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadController } from './ciudad.controller';
import { RestauranteEntity } from '../restaurante/entities/restaurante.entity';
import { PaisEntity } from '../pais/entities/pais.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, RestauranteEntity, PaisEntity])],
  providers: [CiudadService],
  controllers: [CiudadController],
})
export class CiudadModule {}

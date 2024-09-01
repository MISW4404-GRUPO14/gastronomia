import { Module } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { RestaurantesController } from './restaurantes.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Restaurante } from './entities/restaurante.entity';
import { Ciudad } from '../ciudades/entities/ciudad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurante, Ciudad])],
  controllers: [RestaurantesController],
  providers: [RestaurantesService],
})
export class RestaurantesModule {}

import { Module } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';

@Module({
  controllers: [RecetasController],
  providers: [RecetasService],
  imports: [
    TypeOrmModule.forFeature([ Receta ])
  ]
})
export class RecetasModule {}

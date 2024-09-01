import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturasService } from './culturas.service';
import { CulturasController } from './culturas.controller';
import { Cultura } from './entities/cultura.entity';
import { Restaurante } from 'src/restaurantes/entities/restaurante.entity';


@Module({
  controllers: [CulturasController],
  providers: [CulturasService],
  imports: [
    TypeOrmModule.forFeature([ Cultura, Restaurante  ])
  ]
})
export class CulturasModule {}

import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { PaisEntity } from './entities/pais.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisController } from './pais.controller';
import { CiudadEntity } from '../ciudad/entities/ciudad.entity';
import { Cultura } from '../culturas/entities/cultura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity, CiudadEntity, Cultura])],
  providers: [PaisService],
  controllers: [PaisController]
})
export class PaisModule {}

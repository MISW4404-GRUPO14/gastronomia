import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturasService } from './culturas.service';
import { CulturasController } from './culturas.controller';
import { Cultura } from './entities/cultura.entity';

@Module({
  controllers: [CulturasController],
  providers: [CulturasService],
  imports: [
    TypeOrmModule.forFeature([ Cultura ])
  ]
})
export class CulturasModule {}

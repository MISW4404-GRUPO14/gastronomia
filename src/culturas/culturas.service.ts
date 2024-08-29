import { Inject, Injectable } from '@nestjs/common';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CulturasService {
  constructor( 
    @InjectRepository(Cultura)
    private culturaRepository: Repository<Cultura>
  ){}
  create(createCulturaDto: CreateCulturaDto) {
    return 'This action adds a new cultura';
  }

  findAll() {
    return `This action returns all culturas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cultura`;
  }

  update(id: number, updateCulturaDto: UpdateCulturaDto) {
    return `This action updates a #${id} cultura`;
  }

  remove(id: number) {
    return `This action removes a #${id} cultura`;
  }
}

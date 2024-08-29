import { Injectable } from '@nestjs/common';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecetasService {
  constructor( 
    @InjectRepository(Receta)
    private readonly recetaRepository: Repository<Receta>
  ){}

  create(createRecetaDto: CreateRecetaDto) {
    return 'This action adds a new receta';
  }

  findAll() {
    return `This action returns all recetas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} receta`;
  }

  update(id: number, updateRecetaDto: UpdateRecetaDto) {
    return `This action updates a #${id} receta`;
  }

  remove(id: number) {
    return `This action removes a #${id} receta`;
  }
}

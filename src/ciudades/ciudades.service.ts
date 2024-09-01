import { Injectable } from '@nestjs/common';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';

@Injectable()
export class CiudadesService {
  create(createCiudadDto: CreateCiudadDto) {
    return 'This action adds a new ciudade';
  }

  findAll() {
    return `This action returns all ciudades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ciudade`;
  }

  update(id: number, updateCiudadDto: UpdateCiudadDto) {
    return `This action updates a #${id} ciudade`;
  }

  remove(id: number) {
    return `This action removes a #${id} ciudade`;
  }
}

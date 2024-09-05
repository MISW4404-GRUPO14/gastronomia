import { Injectable, HttpStatus } from '@nestjs/common';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { Pais } from './entities/pais.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PaisesService {

  constructor(
    @InjectRepository(Pais)
    private readonly paisRepository: Repository<Pais>
  ){}
  async create(createPaisDto: CreatePaisDto) {
    try{
      const pais = this.paisRepository.create(createPaisDto);
      await this.paisRepository.save( pais );
      return pais
    } catch(error){
      throw new BusinessLogicException(error, HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  async findAll() {
    try {
      const paises = await this.paisRepository.find(); // Usa await aquí
      return paises;
    } catch (error) {
      throw new BusinessLogicException('Failed to get paises due to a server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async findOne(id: string) {
    const pais = await this.paisRepository.findOne(
      {
        where: { id: id }
      }
    );
    if(!pais){
      throw new BusinessLogicException(`The pais with the given id was not found`, HttpStatus.NOT_FOUND);
      }
    return pais;
  }

  async update(id: string, updatePaisDto: UpdatePaisDto) {
    const pais = await this.paisRepository.preload({
      id: id,
      ...updatePaisDto
    });
    if (!pais) {
      throw new BusinessLogicException('The pais with the given id was not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.paisRepository.save(pais);
      return pais;
    } catch (error) {
      throw new BusinessLogicException('Failed to update pais due to a server error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }  

  async remove(id: string) {
    try {
      const pais = await this.findOne(id);
      await this.paisRepository.remove(pais);
      return pais;
    } catch (error) {
      throw new BusinessLogicException('The pais with the given id was not found', HttpStatus.NOT_FOUND);
    }
  }
  
}

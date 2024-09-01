import { Injectable } from '@nestjs/common';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { Logger } from '@nestjs/common';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ciudad } from './entities/ciudad.entity';
import { Repository } from 'typeorm';



@Injectable()
export class CiudadesService {

  private readonly logger = new Logger('CiudadesService')

  constructor(
    @InjectRepository(Ciudad)
    private readonly ciudadRepository: Repository<Ciudad>
  ){}

  async create(createCiudadDto: CreateCiudadDto) {
    try{
      const ciudad = this.ciudadRepository.create(createCiudadDto);
      await this.ciudadRepository.save( ciudad );
      return ciudad
    } catch(error){
      console.log(error);
      this.logger.error(error)
      throw new BusinessLogicException(error, HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  async findAll() {
    try{
      const ciudades = this.ciudadRepository.find();
      return ciudades;
    } catch(error){
      this.logger.error(error)
      throw new BusinessLogicException('Failed to get ciudades due to a server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    const ciudad = await this.ciudadRepository.findOne(
      {
        where: { id: id }
      }
    );
    if(!ciudad){
      throw new BusinessLogicException(`The ciudad with the given id was not found`, HttpStatus.NOT_FOUND);
      }
    return ciudad;
  }

  async update(id: string, updateCiudadDto: UpdateCiudadDto) {
    const ciudad = await this.ciudadRepository.preload({
      id: id,
      ...updateCiudadDto
    })
    if(!ciudad) { 
      throw new BusinessLogicException(`The ciudad with the given id was not found`, HttpStatus.NOT_FOUND);}
    try{
      
      await this.ciudadRepository.save(ciudad);
      return ciudad;
    } catch(error){
      this.logger.error(error)
      throw new BusinessLogicException('Failed to update ciudad due to a server error.', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: string) {
    const ciudad = await this.findOne( id );
    await this.ciudadRepository.remove( ciudad );
  }
}

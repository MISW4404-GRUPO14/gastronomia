import { Injectable } from '@nestjs/common';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurante } from './entities/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class RestaurantesService {

  private readonly logger = new Logger('RestaurantesService')

  constructor(
    @InjectRepository(Restaurante)
    private readonly restauranteRepository: Repository<Restaurante>
  ){}
  
  async create(createRestauranteDto: CreateRestauranteDto) {
    try{
      const restaurante = this.restauranteRepository.create(createRestauranteDto);
      await this.restauranteRepository.save( restaurante );
      return restaurante
    } catch(error){
      throw new BusinessLogicException(error, HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  async findAll() {
    try{
      const restaurantes = this.restauranteRepository.find();
      return restaurantes;
    } catch(error){
      throw new BusinessLogicException('Failed to get restaurantes due to a server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    const restaurante = await this.restauranteRepository.findOne(
      {
        where: { id: id }
      }
    );
    if(!restaurante){
      throw new BusinessLogicException(`The restaurante with the given id was not found`, HttpStatus.NOT_FOUND);
      }
    return restaurante;
  }

  async update(id: string, updateRestauranteDto: UpdateRestauranteDto) {
    const restaurante = await this.restauranteRepository.preload({
      id: id,
      ...updateRestauranteDto
    })
    if(!restaurante) { 
      throw new BusinessLogicException(`The restaurante with the given id was not found`, HttpStatus.NOT_FOUND);}
    try{
      
      await this.restauranteRepository.save(restaurante);
      return restaurante;
    } catch(error){
      throw new BusinessLogicException('Failed to update restaurant due to a server error.', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: string) {
    const restaurante = await this.findOne( id );
    await this.restauranteRepository.remove( restaurante );
  }
}

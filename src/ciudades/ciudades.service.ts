import { Injectable, NotFoundException, Logger,HttpStatus } from '@nestjs/common';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Ciudad } from './entities/ciudad.entity';
import { Repository } from 'typeorm';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';


@Injectable()
export class CiudadesService {

  private readonly logger = new Logger('CiudadesService')

  constructor(
    @InjectRepository(Ciudad)
    private readonly ciudadRepository: Repository<Ciudad>,

    @InjectRepository(Restaurante)
    private readonly restauranteRepository: Repository<Restaurante>
  ){}

  async create(createCiudadDto: CreateCiudadDto) {
    try{
      const ciudad = this.ciudadRepository.create(createCiudadDto);
      await this.ciudadRepository.save( ciudad );
      return ciudad
    } catch(error){
      throw new BusinessLogicException(error, HttpStatus.INTERNAL_SERVER_ERROR )
    }
  }

  async findAll() {
    try {
      const ciudades = await this.ciudadRepository.find();
      return ciudades;
    } catch (error) {
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
      throw new BusinessLogicException('Failed to update ciudad due to a server error.', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async remove(id: string){
    try{
      const ciudad = await this.findOne(id);
      await this.ciudadRepository.remove(ciudad);
      return ciudad;
    } catch(error){
      throw new BusinessLogicException('The ciudad with the given id was not found', HttpStatus.NOT_FOUND);
    }
  }

  async asociarRestauranteACiudad(ciudadId: string, restauranteId: string) {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });
    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${ciudadId} no encontrada`);
    }

    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
    });
    if (!restaurante) {
      throw new NotFoundException(`Restaurante con ID ${restauranteId} no encontrado`);
    }

    if (ciudad.restaurantes.some(r => r.id === restauranteId)) {
      throw new Error(`El restaurante con ID ${restauranteId} ya está asociado a la ciudad`);
    }

    ciudad.restaurantes.push(restaurante);
    return await this.ciudadRepository.save(ciudad);
  }

  async eliminarRestauranteDeCiudad(ciudadId: string, restauranteId: string) {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${ciudadId} no encontrada`);
    }

    const restauranteIndex = ciudad.restaurantes.findIndex(
      (restaurante) => restaurante.id === restauranteId,
    );

    if (restauranteIndex === -1) {
      throw new NotFoundException(`Restaurante con ID ${restauranteId} no está asociado a la ciudad`);
    }
    ciudad.restaurantes.splice(restauranteIndex, 1);
    await this.ciudadRepository.save(ciudad);
  }

  async obtenerRestaurantesDeCiudad(ciudadId: string) {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${ciudadId} no encontrada`);
    }
    return ciudad.restaurantes;
  }

}

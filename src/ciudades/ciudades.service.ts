import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { Logger } from '@nestjs/common';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ciudad } from './entities/ciudad.entity';
import { In, Repository } from 'typeorm';
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

  // Método para asociar un restaurante a una ciudad
  async asociarRestauranteACiudad(ciudadId: string, restauranteId: string) {
    // Buscar la ciudad por ID con sus relaciones
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });
    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${ciudadId} no encontrada`);
    }

    // Buscar el restaurante por ID
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
    });
    if (!restaurante) {
      throw new NotFoundException(`Restaurante con ID ${restauranteId} no encontrado`);
    }

    // Verificar si el restaurante ya está asociado para evitar duplicados
    if (ciudad.restaurantes.some(r => r.id === restauranteId)) {
      throw new Error(`El restaurante con ID ${restauranteId} ya está asociado a la ciudad`);
    }

    // Asociar el restaurante a la ciudad
    ciudad.restaurantes.push(restaurante);

    // Guardar la ciudad con el restaurante asociado
    return await this.ciudadRepository.save(ciudad);
  }

  // Método para eliminar un restaurante de una ciudad
  async eliminarRestauranteDeCiudad(ciudadId: string, restauranteId: string) {
    // Buscar la ciudad por ID con sus relaciones
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });

    if (!ciudad) {
      throw new NotFoundException(`Ciudad con ID ${ciudadId} no encontrada`);
    }

    // Buscar el restaurante en la lista de restaurantes de la ciudad
    const restauranteIndex = ciudad.restaurantes.findIndex(
      (restaurante) => restaurante.id === restauranteId,
    );

    if (restauranteIndex === -1) {
      throw new NotFoundException(`Restaurante con ID ${restauranteId} no está asociado a la ciudad`);
    }

    // Eliminar el restaurante de la lista de la ciudad
    ciudad.restaurantes.splice(restauranteIndex, 1);

    // Guardar la ciudad con la lista de restaurantes actualizada
    await this.ciudadRepository.save(ciudad);
  }

}

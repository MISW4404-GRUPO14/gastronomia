import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurante } from './entities/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Cultura } from '../culturas/entities/cultura.entity';
import { In } from 'typeorm';

@Injectable()
export class RestaurantesService {

  private readonly logger = new Logger('RestaurantesService')

  constructor(
    @InjectRepository(Restaurante)
    private readonly restauranteRepository: Repository<Restaurante>,

    @InjectRepository(Cultura)
    private readonly culturaRepository: Repository<Cultura>,
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
      const restaurantes = await this.restauranteRepository.find();
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

  //Método para agregar culturas a un restaurante
  async agregarCulturasARestaurante(restauranteId: string, culturaIds: string[]) {
    const restaurante = await this.findOne(restauranteId);
    if (!restaurante.culturas) {
      restaurante.culturas = [];
    }
    const culturas = await this.culturaRepository.findBy({ id: In(culturaIds) });
    console.log('Culturas encontradas:', culturas);
    this.validateArrayCulturas(culturas, culturaIds);
    restaurante.culturas.push(...culturas);
    console.log('Culturas agregadas:', restaurante);
    return await this.restauranteRepository.save(restaurante);
  }

  // async agregarCulturasARestaurante(restauranteId: string, culturaIds: string[]) {
  //   // Obtener restaurante con sus culturas actuales
  //   const restaurante = await this.restauranteRepository.findOne({
  //     where: { id: restauranteId },
  //     relations: ['culturas'],
  //   });
  
  //   if (!restaurante) {
  //     throw new BusinessLogicException(`The restaurante with the given id was not found`, HttpStatus.NOT_FOUND);
  //   }
  
  //   // Buscar culturas por IDs proporcionados
  //   const culturas = await this.culturaRepository.findBy({ id: In(culturaIds) });
    
  //   // Validar que todas las culturas solicitadas existan
  //   this.validateArrayCulturas(culturas, culturaIds);
  
  //   // Log para verificar las culturas existentes
  //   this.logger.log(`Culturas encontradas: ${culturas.map(c => c.id).join(', ')}`);
  
  //   // Filtrar culturas ya existentes para evitar duplicados
  //   const culturasExistentesIds = new Set(restaurante.culturas.map(cultura => cultura.id));
  //   const nuevasCulturas = culturas.filter(cultura => !culturasExistentesIds.has(cultura.id));
  
  //   // Verificar si hay nuevas culturas para agregar
  //   if (nuevasCulturas.length === 0) {
  //     throw new BusinessLogicException('No new culturas to add', HttpStatus.BAD_REQUEST);
  //   }
  
  //   // Agregar nuevas culturas al restaurante
  //   restaurante.culturas.push(...nuevasCulturas);
  
  //   try {
  //     // Intentar guardar cambios en el repositorio
  //     return await this.restauranteRepository.save(restaurante);
  //   } catch (error) {
  //     // Log completo del error
  //     this.logger.error('Error adding culturas to restaurante:', error);
  //     // Lanzar excepción con detalles específicos
  //     throw new BusinessLogicException(`Failed to add culturas to restaurante: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // Método para obtener culturas de un restaurante
  async obtenerCulturasDeRestaurante(restauranteId: string) {
    const restaurante = await this.findOne(restauranteId);
    return restaurante.culturas;
  }

  // Método para actualizar la lista de culturas de un restaurante
  async actualizarCulturasEnRestaurante(restauranteId: string, culturaIds: string[]) {
    const restaurante = await this.findOne(restauranteId);
    const nuevasCulturas = await this.culturaRepository.findBy({ id: In(culturaIds) });
    this.validateArrayCulturas(nuevasCulturas, culturaIds);
    restaurante.culturas = Array.from(new Set(nuevasCulturas.map(cultura => cultura.id)))
      .map(id => nuevasCulturas.find(cultura => cultura.id === id));

    return await this.restauranteRepository.save(restaurante);
  }

  // Método para eliminar una cultura de un restaurante
  async eliminarCulturaDeRestaurante(restauranteId: string, culturaId: string) {
    const restaurante = await this.findOne(restauranteId);
    restaurante.culturas = (restaurante.culturas || []).filter(cultura => cultura.id !== culturaId);
    return await this.restauranteRepository.save(restaurante);
  }

  // Validación de que todas las culturas existen
  private validateArrayCulturas(culturas, culturaIds) { 
    console.log('Culturas encontradas:', culturas);
    if (culturas.length !== culturaIds.length) {
      throw new BusinessLogicException(`Alguna de las culturas no existe`, HttpStatus.NOT_FOUND);
    }
  }
}

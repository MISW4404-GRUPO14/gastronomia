import { HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';
import { In, Repository } from 'typeorm';
import { PaisEntity } from 'src/pais/entities/pais.entity';
import { BusinessLogicException } from 'src/shared/errors/business-errors';
import { RestauranteEntity } from 'src/restaurante/entities/restaurante.entity';

@Injectable()
export class CulturasService {

  private readonly logger = new Logger('CulturasService');

  constructor( 
    @InjectRepository(Cultura)
    private culturaRepository: Repository<Cultura>,

    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>
  ){}
  
  async create(createCulturaDto: CreateCulturaDto) {
    try{
      const cultura = this.culturaRepository.create(createCulturaDto);
      await this.culturaRepository.save( cultura );
      return cultura
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to create resource due to a server error.')
    }
    //return 'This action adds a new cultura';
  }

  async findAll() {
    try{
      const culturas = this.culturaRepository.find();
      return culturas;
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to find a resource due to a server error.')
    }
    //return `This action returns all culturas`;
  }

  async findOne(id:string) {
    const cultura = await this.culturaRepository.findOneBy({ id });
    if(!cultura){
      throw new NotFoundException(`The culture with the given id ${id} was not found`)
      }
    return cultura;
    //return `This action returns a #${id} cultura`;
  }

  async update(id:string, updateCulturaDto: UpdateCulturaDto) {
    try{  
      const cultura = await this.culturaRepository.preload({
        id: id,
        ...updateCulturaDto
      })
      if ( !cultura ) throw new NotFoundException(`The culture with the given id ${id} was not found`)
      await this.culturaRepository.save( cultura );
      return cultura; 
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to update culture due to a server error.')
    }
    //return `This action updates a #${id} cultura`;
  }

  async remove(id:string) {
    const cultura = await this.findOne(id)
    if(cultura){
      await this.culturaRepository.remove(cultura)
    }else{
      throw new NotFoundException(`The culture with the given id ${id} was not found`)
    }
    //return `This action removes a #${id} cultura`;
  }

//-----------------------------Paises de una cultura---------------------------------------------------//

  //Método para agregar paises a una cultura
  async agregarPaisesACultura(culturaId: string, paisIds: string[]) {
    const culture = await this.findOne(culturaId);
    const paises = await this.paisRepository.findBy({ id: In(paisIds) });
    this.validateArrayPaises(paises, paisIds)
    culture.paises.push(...paises);
    return await this.paisRepository.save(culture);
  }

  //Método para obtener paises de una cultura
  async obtenerPaisesDecultura(culturaId: string) {
    const culture = await this.findOne(culturaId);
    return culture
  }

  //Método para actualizar el listado de paises de una cultura
  async actualizarPaisesEnCultura(culturaId: string, paisesIds: string[]){
    const culture = await this.findOne(culturaId);
    const nuevosPaises =  await this.paisRepository.findBy({ id: In(paisesIds) });
    // Validar que todos los paises existan
    this.validateArrayPaises(nuevosPaises, paisesIds)
    culture.paises = nuevosPaises;
    return await this.culturaRepository.save(culture);
  }

  //Método para eliminar un pais de una cultura
  async eliminarPaisDeCultura(culturaId: string, paisId: string){
    const culture = await this.findOne(culturaId);
    culture.paises = culture.paises.filter(pais => pais.id !== paisId);

    return await this.culturaRepository.save(culture);
  }

  validateArrayPaises(paises, paisIds){
    if (paises.length !== paisIds.length) {
      const paisesExistentesIds = paises.map(pais => pais.id);
      const paisesNoEncontrados = paisIds.filter(id => !paisesExistentesIds.includes(id));
      throw new BusinessLogicException(`Alguno de los paises no existe`, HttpStatus.NOT_FOUND);
    }
  }

  //-----------------------------Restaurantes de una cultura---------------------------------------------------//

  //Método para agregar restaurentes a una cultura
  async agregarRestaurantesACultura(culturaId: string, restaurantesIds: string[]) {
    const culture = await this.findOne(culturaId);
    const restaurantes = await this.restauranteRepository.findBy({ id: In(restaurantesIds) });
    this.validateArrayRestaurantes(restaurantes, restaurantesIds)
    culture.restaurantes.push(...restaurantes);
    return await this.paisRepository.save(culture);
  }

  //Método para obtener restaurantes de una cultura
  async obtenerRestaurantesDecultura(culturaId: string) {
    const culture = await this.findOne(culturaId);
    return culture
  }

  //Método para actualizar el listado de restaurantes de una cultura
  async actualizarRestaurantesEnCultura(culturaId: string, restaurantesIds: string[]){
    const culture = await this.findOne(culturaId);
    const nuevosRestaurantes =  await this.restauranteRepository.findBy({ id: In(restaurantesIds) });
    // Validar que todos los restaurantes existan
    this.validateArrayRestaurantes(nuevosRestaurantes, restaurantesIds)
    culture.restaurantes = nuevosRestaurantes;
    return await this.culturaRepository.save(culture);
  }

  //Método para eliminar un restaurante de una cultura
  async eliminarRestauranteDeCultura(culturaId: string, restauranteId: string){
    const culture = await this.findOne(culturaId);
    culture.restaurantes = culture.restaurantes.filter(restaurante => restaurante.id !== restauranteId);

    return await this.culturaRepository.save(culture);
  }

  validateArrayRestaurantes(restaurantes, restauranteIds){
    if (restaurantes.length !== restauranteIds.length) {
      const restaurantesExistentesIds = restaurantes.map(restaurante => restaurante.id);
      const restaurantesNoEncontrados = restauranteIds.filter(id => !restaurantesExistentesIds.includes(id));
      throw new BusinessLogicException(`Alguno de los restaurantes no existe`, HttpStatus.NOT_FOUND);
    }
  }
}

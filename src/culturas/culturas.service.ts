import { HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';
import { In, Repository } from 'typeorm';
import { Pais } from '../paises/entities/pais.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class CulturasService {

  private readonly logger = new Logger('CulturasService');

  constructor( 
    @InjectRepository(Cultura)
    private culturaRepository: Repository<Cultura>,

    @InjectRepository(Pais)
    private readonly paisRepository: Repository<Pais>,

    @InjectRepository(Restaurante)
    private readonly restauranteRepository: Repository<Restaurante>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>
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
  }

  async findAll() {
    try{
      const culturas = await this.culturaRepository.find();
      return culturas;
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to find a resource due to a server error.')
    }
  }

  async findOne(id:string) {
    const cultura = await this.culturaRepository.findOneBy({ id });
    if(!cultura){
      throw new NotFoundException(`The culture with the given id ${id} was not found`)
      }
    return cultura;
  }

  async update(id: string, updateCulturaDto: UpdateCulturaDto): Promise<Cultura> {
    const cultura = await this.culturaRepository.preload({
      id: id,
      ...updateCulturaDto
    });
  
    if (!cultura) {
      throw new NotFoundException(`The culture with the given id ${id} was not found`);
    }
  
    try {
      await this.culturaRepository.save(cultura);
      return cultura;
    } catch (error) {
      this.logger.error(`Failed to update culture with id ${id}:`, error);
      throw new InternalServerErrorException('Failed to update culture due to a server error.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const cultura = await this.findOne(id);
      if (cultura) {
        await this.culturaRepository.remove(cultura);
        return;
      } else {
        throw new NotFoundException(`The culture with the given id ${id} was not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to remove culture with id ${id}:`, error);
      throw new InternalServerErrorException('Failed to remove culture due to a server error.');
    }
  }
  
  

//-----------------------------Paises de una cultura---------------------------------------------------//

  //Método para agregar paises a una cultura
  async agregarPaisesACultura(culturaId: string, paisIds: string[]) {
    const culture = await this.findOne(culturaId);
    if (!culture.paises)
      culture.paises = []
    const paises = await this.paisRepository.findBy({ id: In(paisIds) });
    this.validateArrayPaises(paises, paisIds)
    culture.paises.push(...paises);
    return await this.culturaRepository.save(culture);
  }
  

  //Método para obtener paises de una cultura
  async obtenerPaisesDecultura(culturaId: string) {
    const culture = await this.findOne(culturaId);
    return culture
  }

  //Método para actualizar el listado de paises de una cultura
  async actualizarPaisesEnCultura(culturaId: string, paisesIds: string[]): Promise<Cultura> {
    const cultura = await this.findOne(culturaId);
    const nuevosPaises = await this.paisRepository.findBy({ id: In(paisesIds) });
    this.validateArrayPaises(nuevosPaises, paisesIds);
    cultura.paises = Array.from(new Set(nuevosPaises.map(pais => pais.id)))
      .map(id => nuevosPaises.find(pais => pais.id === id));
    
    return await this.culturaRepository.save(cultura);
  }
  

  //Método para eliminar un pais de una cultura
  async eliminarPaisDeCultura(culturaId: string, paisId: string){
    const culture = await this.findOne(culturaId);
    culture.paises = culture.paises.filter(pais => pais.id !== paisId);

    return await this.culturaRepository.save(culture);
  }

  validateArrayPaises(paises, paisIds){
    if (paises.length !== paisIds.length) {
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
    return await this.culturaRepository.save(culture);
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
      throw new BusinessLogicException(`Alguno de los restaurantes no existe`, HttpStatus.NOT_FOUND);
    }
  }

  async agregarProductoAcultura( culturaId: string, productoId: string){
      const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}});
      if (!cultura)
        throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND);
      if (!cultura.productos) {
        cultura.productos = [];
      }

      const producto: Producto = await this.productoRepository.findOne({where: {id: productoId}}) 
      if (!producto)
        throw new BusinessLogicException("El producto no existe con ese id", HttpStatus.NOT_FOUND);
    
      const productoYaEnCultura = cultura.productos.some(p => p.id === productoId);
      if (productoYaEnCultura) {
          throw new BusinessLogicException("El producto ya está asociado a esta cultura", HttpStatus.BAD_REQUEST);
      }

      cultura.productos.push(producto);
    return await this.culturaRepository.save(cultura);
  }

  async obtenerProductoDeCultura(culturaId: string, productoId: string){
      const producto: Producto = await this.productoRepository.findOne({where: {id: productoId}});
      if (!producto)
        throw new BusinessLogicException("El producto no existe con ese id", HttpStatus.NOT_FOUND)
      
      const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos"]}); 
      if (!cultura)
        throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND)

      const culturaProducto: Producto = cultura.productos.find(e => e.id === producto.id);

      if (!culturaProducto)
        throw new BusinessLogicException("El producto con ese id no se encuentra asociado a la cultura", HttpStatus.PRECONDITION_FAILED)

    return culturaProducto;
  }

  async obtenerTodoLosProductosDeCultura(culturaId: string){
    const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
    if (!cultura)
      throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND)
      
    return cultura.productos;
  }

  async actualizarProductosDeLaCultura(culturaId: string, productos: Producto[]){
    console.log(productos)
    const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
     
    if (!cultura)
      throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND)
  
    const productosValidos: Producto[] = [];

    for (let i = 0; i < productos.length; i++) {
      const productoExistente: Producto = await this.productoRepository.findOne({where: {id: productos[i].id}});
      if (!productoExistente)
        throw new BusinessLogicException("The artwork with the given id was not found", HttpStatus.NOT_FOUND)
      
      productosValidos.push(productoExistente)
      console.log(productosValidos)
    }
 
    cultura.productos = productosValidos;

    return await this.culturaRepository.save(cultura);
  }
  
  async eliminarProductoDeCultura(culturaId: string, productoId: string){
    const producto: Producto = await this.productoRepository.findOne({where: {id: productoId}});
    if (!producto)
      throw new BusinessLogicException("El producto no existe con ese id", HttpStatus.NOT_FOUND)
  
    const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
    if (!cultura)
      throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND)
  
    const culturaProducto: Producto = cultura.productos.find(e => e.id === producto.id);
  
    if (!culturaProducto)
        throw new BusinessLogicException("El producto con ese id no se encuentra asociado a la cultura", HttpStatus.PRECONDITION_FAILED)

    cultura.productos = cultura.productos.filter(e => e.id !== productoId);
    await this.culturaRepository.save(cultura);
  }
  





}

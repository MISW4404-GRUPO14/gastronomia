import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Categoria } from '../categorias/entities/categoria.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProductosService {
  constructor( 
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private httpService: HttpService,

  ){}

  async create(createProductoDto: CreateProductoDto) {
    const categoriaId = createProductoDto.idCategoria;
    
    if (categoriaId) 
      try {
        const response = await lastValueFrom(
          this.httpService.get(`http://localhost:3000/api/v1/categorias/${categoriaId}`)
        );
        
        if (response.status !== HttpStatus.OK) {
          throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
        }
      } catch (error) {
        throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
      }
    
    return this.productoRepository.save(createProductoDto);
  }

  

  async findAll() : Promise<Producto[]>{
    return await this.productoRepository.find({ relations: ["idCategoria"] });
  }

  async findOne(id: string): Promise<{}> {
    const producto: Producto = await this.productoRepository.findOne({where: {id}, relations: ["idCategoria"] } );
    if (!producto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);

    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const existeProducto: Producto = await this.productoRepository.findOne({where:{id}});
    if (!existeProducto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);
      
    const categoriaId = updateProductoDto.idCategoria;
    
    if (categoriaId) 
      try {
        const response = await lastValueFrom(
          this.httpService.get(`http://localhost:3000/api/v1/categorias/${categoriaId}`)
        );
        
        if (response.status !== HttpStatus.OK) {
          throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
        }
      } catch (error) {
        throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
      }

    return await this.productoRepository.save(updateProductoDto);

}

  async remove(id: string)  {
    const producto: Producto = await this.productoRepository.findOne({where:{id}});
    if (!producto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);
 
    throw new BusinessLogicException("The record has been successfully deleted.", HttpStatus.NO_CONTENT);
  }
}

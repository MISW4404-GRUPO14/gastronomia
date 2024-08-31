import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  constructor( 
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
   
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>

  ){}

  async create(createProductoDto: CreateProductoDto) {
    const categoriaId = createProductoDto.idCategoria;
    
    if (categoriaId) {
      const cate: Categoria = await this.categoriaRepository.findOne({where: {id: categoriaId}});
        
      if (!cate){
        throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
      }
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
    
    if (categoriaId) {
      const cate: Categoria = await this.categoriaRepository.findOne({where: {id: categoriaId}});
        
      if (!cate){
        throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
      }
    } 
    return await this.productoRepository.save(updateProductoDto);

}

  async remove(id: string)  {
    const producto: Producto = await this.productoRepository.findOne({where:{id}});
    if (!producto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);
   
    await this.productoRepository.remove(producto);
  }
}

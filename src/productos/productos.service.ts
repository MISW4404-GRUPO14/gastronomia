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
    const categoriaId = createProductoDto.categoria;
    
    if (categoriaId) {
      const cate: Categoria = await this.categoriaRepository.findOne({where: {id: categoriaId}});
        
      if (!cate){
        throw new BusinessLogicException("No existe una categoria con ese id", HttpStatus.BAD_REQUEST);
      }
    }
    
    return this.productoRepository.save(createProductoDto);
  }

  

  async findAll(){
    return await this.productoRepository.find({ relations: ["categoria"] });
  }

  async findOne(id: string){
    const producto = await this.productoRepository.findOne({where: {id}, relations: ["categoria"] } );
    if (!producto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);

    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const existeProducto: Producto = await this.productoRepository.findOne({where:{id}});
    if (!existeProducto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);
      
    const categoriaId = updateProductoDto.categoria;
    
    if (categoriaId) {
      const cate: Categoria = await this.categoriaRepository.findOne({where: {id: categoriaId}});
        
      if (!cate){
        throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
      }
    }
    existeProducto.nombre = updateProductoDto.nombre;
    existeProducto.descripcion = updateProductoDto.descripcion;
    existeProducto.historia = updateProductoDto.historia;
    existeProducto.categoria = updateProductoDto.categoria;
    return await this.productoRepository.save(existeProducto);

  }

  async remove(id: string)  {
    const producto: Producto = await this.productoRepository.findOne({where:{id}});
    if (!producto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);
   
    await this.productoRepository.remove(producto);
  }

  


  async agregarCategoriaAProducto(productoId: string, categoriaId: string) {
    const categoriaExiste = await this.categoriaRepository.findBy({ id: categoriaId });

    if (!categoriaExiste || categoriaExiste.length==0){
      console.log(categoriaExiste.length==0)
      throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
    }
    const producto  = await this.findOne(productoId);
   
    producto.categoria = categoriaId;
    return await this.productoRepository.save(producto);
  }

   async obtenerCategoriaDeProducto(productoId: string) {
    const producto = await this.findOne(productoId);
    return producto
  }

  async actualizarCategoriaEnProductos(productoId: string, categoriaId: string){
    const producto = await this.findOne(productoId);
    const nuevaCategoria =  await this.productoRepository.findBy({ id:categoriaId });
    if (!nuevaCategoria){
      throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
    }

    producto.categoria = categoriaId;
    return await this.productoRepository.save(producto);
  }

  async eliminarCategoriaDeProducto(productoId: string){
    const producto = await this.findOne(productoId);
    producto.categoria = null;

    return await this.productoRepository.save(producto);
  }



}

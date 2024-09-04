import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productosService.remove(id);
  }




  
  @Post(':id/categorias')
  async agregarCategoria(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() categoriaDto: CreateCategoriaDto
  ){
    return this.productosService.agregarCategoriaAProducto(id, categoriaDto.categoriaId);
  }

  @Get(':id/categorias')
  async obtenerCategoria(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.productosService.obtenerCategoriaDeProducto(id);
  }

  @Put(':id/categorias')
  async actualizarCategoria(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() categoriaDto: CreateCategoriaDto
  ){
    return this.productosService.actualizarCategoriaEnProductos(id, categoriaDto.categoriaId);
  }

  @Delete(':id/categorias')
  async eliminarCategoria(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.productosService.eliminarCategoriaDeProducto(id);
  }


}

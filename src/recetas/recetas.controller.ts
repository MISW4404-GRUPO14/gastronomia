import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { AgregarProductosDto } from './dto/agregar-productos.dto';
import { EliminarProductoDto } from './dto/eliminar-productos.dto';

@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Post()
  create(@Body() createRecetaDto: CreateRecetaDto) {
    return this.recetasService.create(createRecetaDto);
  }

  @Get()
  findAll() {
    return this.recetasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.recetasService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateRecetaDto: UpdateRecetaDto) {
    return this.recetasService.update( id, updateRecetaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.recetasService.remove(id);
  }

  @Post(':id/productos')
  async agregarProductos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarProductosDto: AgregarProductosDto
  ){
    return this.recetasService.agregarProductosAReceta(id, agregarProductosDto.productoIds);
  }

  @Get(':id/productos')
  async obtenerProductos(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.recetasService.obtenerProductosDeReceta(id);
  }

  @Put(':id/productos')
  async actualizarProductos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarProductosDto: AgregarProductosDto
  ){
    return this.recetasService.actualizarProductosEnReceta(id, agregarProductosDto.productoIds);
  }

  @Delete(':recetaId/productos/:productoId')
  async eliminarProducto(
    @Param() params: EliminarProductoDto
  ){
    const {recetaId, productoId} = params
    return this.recetasService.eliminarProductoDeReceta(recetaId, productoId);
  }

}

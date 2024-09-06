import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { CulturasService } from './culturas.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { AgregarPaisesDto } from './dto/agregar-paises.dto';
import { EliminarPaisDto } from './dto/eliminar-paises.dto';
import { AgregarRestaurantesDto } from './dto/agregar-restaurantes.dto';
import { ActualizarProductosDto } from './dto/actualizar-productos.dto';
import { plainToInstance } from 'class-transformer';
import { Producto } from '../productos/entities/producto.entity';
import { Response } from 'express';

@Controller('culturas')
export class CulturasController {
  constructor(private readonly culturasService: CulturasService) {}

  @Post()
  create(@Body() createCulturaDto: CreateCulturaDto) {
    return this.culturasService.create(createCulturaDto);
  }

  @Get()
  findAll() {
    return this.culturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.culturasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCulturaDto: UpdateCulturaDto) {
    return this.culturasService.update(id, updateCulturaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response): Promise<void> {
    await this.culturasService.remove(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Post(':id/paises')
  async agregarPaises(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarPaisesDto: AgregarPaisesDto
  ){
    return this.culturasService.agregarPaisesACultura(id, agregarPaisesDto.paisIds);
  }

  @Get(':id/paises')
  async obtenerPaises(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.culturasService.obtenerPaisesDecultura(id);
  }

  @Put(':id/paises')
  async actualizarPais(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarPaisesDto: AgregarPaisesDto
  ){
    return this.culturasService.actualizarPaisesEnCultura(id, agregarPaisesDto.paisIds);
  }

  @Delete(':culturaId/paises/:paisId')
  async eliminarPais(
    @Param() params: EliminarPaisDto
  ){
    const {culturaId, paisId} = params
    return this.culturasService.eliminarPaisDeCultura(culturaId, paisId);
  }

  @Post(':id/paises')
  async agregarRestaurantes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarRestaurantesDto: AgregarRestaurantesDto
  ){
    return this.culturasService.agregarRestaurantesACultura(id, agregarRestaurantesDto.restaurantesIds);
  }

  
  @Post(':culturaId/productos/:productoId')
  async agregarProductoAcultura(@Param('culturaId') culturaId: string, @Param('productoId') productoId: string){
      return await this.culturasService.agregarProductoAcultura(culturaId, productoId);
  }

  @Get(':culturaId/productos/:productoId')
  async obtenerProductoDeCultura(@Param('culturaId') culturaId: string, @Param('productoId') productoId: string){
      return await this.culturasService.obtenerProductoDeCultura(culturaId, productoId);
  }

  @Get(':culturaId/productos')
  async obtenerTodoLosProductosDeCultura(@Param('culturaId') culturaId: string){
      return await this.culturasService.obtenerTodoLosProductosDeCultura(culturaId);
  }

  @Put(':culturaId/productos')
  async actualizarProductosDeLaCultura(@Param('culturaId') culturaId: string, @Body() actualizarProductosDto: ActualizarProductosDto){
    const productos = plainToInstance(Producto, actualizarProductosDto.productosIds)  
    return await this.culturasService.actualizarProductosDeLaCultura(culturaId, productos);
  }
  
  @Delete(':culturaId/productos/:productoId')
  @HttpCode(204)
  async eliminarProductoDeCultura(@Param('culturaId') culturaId: string, @Param('productoId') productoId: string){
      return await this.culturasService.eliminarProductoDeCultura(culturaId, productoId);
  }
  


}

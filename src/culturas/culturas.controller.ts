import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Res, HttpStatus } from '@nestjs/common';
import { CulturasService } from './culturas.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { AgregarPaisesDto } from './dto/agregar-paises.dto';
import { EliminarPaisDto } from './dto/eliminar-paises.dto';
import { AgregarRestaurantesDto } from './dto/agregar-restaurantes.dto';
import { Response } from 'express';
import { AgregarRecetasDto } from './dto/agregar-receta.dto';
import { EliminarRecetaDto } from './dto/eliminar-receta.dtos';

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

  @Post(':id/recetas')
  async agregarProductos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarRecetaDto: AgregarRecetasDto
  ){
    return this.culturasService.agregarRecetaACultura(id, agregarRecetaDto.recetasId);
  }

  @Get(':id/recetas')
  async obtenerProductos(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.culturasService.obtenerRecetasDeCultura(id);
  }

  @Put(':id/recetas')
  async actualizarProductos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarRecetasDto: AgregarRecetasDto
  ){
    return this.culturasService.actualizarRecetasEnCultura(id, agregarRecetasDto.recetasId);
  }

  @Delete(':id/recetas/:recetaId')
  async eliminarProducto(
    @Param() params: EliminarRecetaDto
  ){
    const {culturaId, recetaId} = params
    return this.culturasService.eliminarRecetaDeCultura(culturaId, recetaId);
  }
}

import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CulturasService } from './culturas.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { AgregarPaisesDto } from './dto/agregar-paises.dto';
import { EliminarPaisDto } from './dto/eliminar-paises.dto';
import { AgregarRestaurantesDto } from './dto/agregar-restaurantes.dto';

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
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.culturasService.remove(id);
  }

  // Paises de una cultura

  @Post(':id/paises')
  async agregarPaises(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarPaisesDto: AgregarPaisesDto
  ){
    return this.culturasService.agregarPaisesACultura(id, agregarPaisesDto.paisesIds);
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
    return this.culturasService.actualizarPaisesEnCultura(id, agregarPaisesDto.paisesIds);
  }

  @Delete(':culturaId/paises/:paisId')
  async eliminarPais(
    @Param() params: EliminarPaisDto
  ){
    const {culturaId, paisId} = params
    return this.culturasService.eliminarPaisDeCultura(culturaId, paisId);
  }

  // Restaurante de una cultura

  @Post(':id/paises')
  async agregarRestaurantes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarRestaurantesDto: AgregarRestaurantesDto
  ){
    return this.culturasService.agregarRestaurantesACultura(id, agregarRestaurantesDto.restaurantesIds);
  }
}

import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { AgregarCulturasDto } from './dto/agregar-culturas.dto';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restaurantesService: RestaurantesService) {}

  @Post()
  create(@Body() createRestauranteDto: CreateRestauranteDto) {
    return this.restaurantesService.create(createRestauranteDto);
  }

  @Get()
  findAll() {
    return this.restaurantesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateRestauranteDto: UpdateRestauranteDto) {
    return this.restaurantesService.update(id, updateRestauranteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantesService.remove(id);
  }

  @Post(':id/culturas')
  async agregarCulturas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarCulturasDto: AgregarCulturasDto
  ){
    return this.restaurantesService.agregarCulturasARestaurante(id, agregarCulturasDto.culturaIds);
  }

  @Get(':id/culturas')
  async obtenerCulturas(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.restaurantesService.obtenerCulturasDeRestaurante(id);
  }

  @Put(':id/culturas')
  async actualizarCulturas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarCulturasDto: AgregarCulturasDto
  ){
    return this.restaurantesService.actualizarCulturasEnRestaurante(id, agregarCulturasDto.culturaIds);
  }

  

}

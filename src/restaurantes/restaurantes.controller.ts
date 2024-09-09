import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Res, HttpStatus } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { AgregarCulturasDto } from './dto/agregar-culturas.dto';
import { Response } from 'express';

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
    @Body() AgregarCulturasDto: AgregarCulturasDto
  ){
    return this.restaurantesService.agregarCulturaARestaurante(id, AgregarCulturasDto.culturaIds);
  }

  @Get(':id/culturas')
  async obtenerCulturasDeRestaurante(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantesService.obtenerCulturasDeRestaurante(id);
  }

  @Put(':id/culturas')
  async actualizarCulturas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarCulturasDto: AgregarCulturasDto
  ) {
    return this.restaurantesService.actualizarCulturasDeRestaurante(id, agregarCulturasDto.culturaIds);
  }
  
  @Delete(':restauranteId/culturas/:culturaId')
  async eliminarCultura(
    @Param('restauranteId', ParseUUIDPipe) restauranteId: string,
    @Param('culturaId', ParseUUIDPipe) culturaId: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.restaurantesService.eliminarCulturaDeRestaurante(restauranteId, culturaId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}

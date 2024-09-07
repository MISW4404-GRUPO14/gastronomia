import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { CulturasService } from './culturas.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { AgregarPaisesDto } from './dto/agregar-paises.dto';
import { AgregarRestaurantesDto } from './dto/agregar-restaurantes.dto';
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

  //-----------------------------Paises de una cultura---------------------------------------------------//

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
  @HttpCode(204)
  async eliminarPais(
    @Param('culturaId', ParseUUIDPipe) culturaId: string,
    @Param('paisId', ParseUUIDPipe) paisId: string,
    @Res() res: Response
  ): Promise<void> {
    await this.culturasService.eliminarPaisDeCultura(culturaId, paisId);
    res.status(HttpStatus.NO_CONTENT).send();
  }


  @Post(':id/paises')
  async agregarRestaurantes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarRestaurantesDto: AgregarRestaurantesDto
  ){
    return this.culturasService.agregarRestaurantesACultura(id, agregarRestaurantesDto.restaurantesIds);
  }
}

//-----------------------------Restaurantes de una cultura---------------------------------------------------//

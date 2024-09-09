import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Res, HttpStatus } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { AgregarCulturasDto } from './dto/agregar-culturas.dto';
import { Response } from 'express';


@Controller('paises')
export class PaisesController {
  constructor(private readonly paisesService: PaisesService) {}

  @Post()
  create(@Body() createPaisDto: CreatePaisDto) {
    return this.paisesService.create(createPaisDto);
  }

  @Get()
  findAll() {
    return this.paisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paisesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updatePaisDto: UpdatePaisDto) {
    return this.paisesService.update(id, updatePaisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paisesService.remove(id);
  }

  @Post(':id/culturas')
  async agregarCulturas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() AgregarCulturasDto: AgregarCulturasDto
  ){
    return this.paisesService.agregarCulturaAPaises(id, AgregarCulturasDto.culturaIds);
  }

  @Get(':id/culturas')
  async obtenerCulturasDePais(@Param('id', ParseUUIDPipe) id: string) {
    return this.paisesService.obtenerCulturasDePais(id);
  }

  @Put(':id/culturas')
  async actualizarCulturas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarCulturasDto: AgregarCulturasDto
  ) {
    return this.paisesService.actualizarCulturasDePais(id, agregarCulturasDto.culturaIds);
  }
  
  @Delete(':paisId/culturas/:culturaId')
  async eliminarCultura(
    @Param('paisId', ParseUUIDPipe) paisId: string,
    @Param('culturaId', ParseUUIDPipe) culturaId: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.paisesService.eliminarCulturaDePais(paisId, culturaId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}

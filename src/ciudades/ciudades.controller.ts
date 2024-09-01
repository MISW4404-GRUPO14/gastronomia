import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { NotFoundException } from '@nestjs/common';

@Controller('ciudades')
export class CiudadesController {
  constructor(private readonly ciudadesService: CiudadesService) {}

  @Post()
  create(@Body() createCiudadDto: CreateCiudadDto) {
    return this.ciudadesService.create(createCiudadDto);
  }

  @Get()
  findAll() {
    return this.ciudadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ciudadesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCiudadDto: UpdateCiudadDto) {
    return this.ciudadesService.update(id, updateCiudadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ciudadesService.remove(id);
  }

  // Endpoint para asociar un restaurante a una ciudad
  @Post(':ciudadId/restaurantes/:restauranteId')
  async asociarRestauranteACiudad(
    @Param('ciudadId', ParseUUIDPipe) ciudadId: string,
    @Param('restauranteId', ParseUUIDPipe) restauranteId: string,
  ) {
    try {
      return await this.ciudadesService.asociarRestauranteACiudad(ciudadId, restauranteId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // Endpoint para eliminar un restaurante de una ciudad
  @Delete(':ciudadId/restaurantes/:restauranteId')
  async eliminarRestauranteDeCiudad(
    @Param('ciudadId', ParseUUIDPipe) ciudadId: string,
    @Param('restauranteId', ParseUUIDPipe) restauranteId: string,
  ) {
    try {
      await this.ciudadesService.eliminarRestauranteDeCiudad(ciudadId, restauranteId);
      return { message: `Restaurante con ID ${restauranteId} eliminado de la ciudad con ID ${ciudadId}` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // Endpoint para obtener los restaurantes de una ciudad
  @Get(':ciudadId/restaurantes')
  async obtenerRestaurantesDeCiudad(
    @Param('ciudadId', ParseUUIDPipe) ciudadId: string,
  ) {
    return await this.ciudadesService.obtenerRestaurantesDeCiudad(ciudadId);
  }
}

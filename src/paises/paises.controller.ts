import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';


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
}

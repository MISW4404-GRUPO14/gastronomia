import { Controller } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { Body, Get, Param, ParseUUIDPipe, Post, Put, Delete } from '@nestjs/common';
import { RestauranteEntity } from './entities/restaurante.entity';


@Controller('restaurante')
export class RestauranteController {

    constructor(private readonly restauranteService: RestauranteService) {}

    @Post()
    create(@Body() createRestauranteDto: CreateRestauranteDto) {
        return this.restauranteService.create(createRestauranteDto);
    }

    @Get()
    findAll() {
        return this.restauranteService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.restauranteService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string, 
        @Body() updateRestauranteDto: UpdateRestauranteDto
    ) {
        return this.restauranteService.update(id, updateRestauranteDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.restauranteService.remove(id);
    }
}

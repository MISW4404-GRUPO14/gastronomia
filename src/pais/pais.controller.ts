import { Controller } from '@nestjs/common';
import { PaisService } from './pais.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { Body, Get, Param, ParseUUIDPipe, Post, Put, Delete } from '@nestjs/common';
import { UpdatePaisDto } from './dto/update-pais.dto';


@Controller('pais')
export class PaisController {
    
    constructor(private readonly paisService: PaisService) {}

    @Post()
    create(@Body() createPaisDto: CreatePaisDto) {
        return this.paisService.create(createPaisDto);
    }

    @Get()
    findAll() {
        return this.paisService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.paisService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePaisDto: UpdatePaisDto) {
    return this.paisService.update(id, updatePaisDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.paisService.remove(id);
    }
}

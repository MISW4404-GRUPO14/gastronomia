import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './entities/ciudad.entity';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { BusinessLogicException } from 'src/shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class CiudadService {

    private readonly logger = new Logger('CiudadService');
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
    ) {}

    async findAll() {
        try{
          const ciudades = this.ciudadRepository.find();
          return ciudades;
        } catch(error){
          this.logger.error(error)
          throw new InternalServerErrorException('Failed to create resource due to a server error.')
        }
      }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["pais", "restaurantes"] });
        if (!ciudad)
          throw new BusinessLogicException("The ciudad with the given id was not found", HttpStatus.NOT_FOUND);

        return ciudad;
    }

    async create(createCiudadDto: CreateCiudadDto): Promise<CiudadEntity> {
        try {
            const ciudad = this.ciudadRepository.create(createCiudadDto as Partial<CiudadEntity>);
            await this.ciudadRepository.save(ciudad);
            return ciudad;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Failed to create resource due to a server error.');
        }
    }
    

    async update(id: string, updateCiudadDto: UpdateCiudadDto): Promise<CiudadEntity> {
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});
        if (!persistedCiudad)
          throw new BusinessLogicException("The ciudad with the given id was not found", HttpStatus.NOT_FOUND);

        const updatedCiudad = Object.assign(persistedCiudad, updateCiudadDto);
        return await this.ciudadRepository.save(updatedCiudad);
    }

    async remove(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});
        if (!ciudad)
          throw new BusinessLogicException("The ciudad with the given id was not found", HttpStatus.NOT_FOUND);

        await this.ciudadRepository.remove(ciudad);
    }
}


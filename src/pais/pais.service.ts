import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisEntity } from './entities/pais.entity';
import { BusinessLogicException } from 'src/shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { DeepPartial } from 'typeorm';

@Injectable()
export class PaisService {

    private readonly logger = new Logger('PaisService');
    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>,
    ) {}

    async findAll(): Promise<PaisEntity[]> {
        return await this.paisRepository.find({ relations: ["culturas", "ciudades"] });
    }

    async findOne(id: string): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id}, relations: ["culturas", "ciudades"] } );
        if (!pais)
          throw new BusinessLogicException("The pais with the given id was not found", HttpStatus.NOT_FOUND);
   
        return pais;
    }

    async create(createPaisDto: CreatePaisDto): Promise<PaisEntity> {
        try {
            const pais = this.paisRepository.create(createPaisDto as Partial<PaisEntity>);
            await this.paisRepository.save(pais);
            return pais;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Failed to create resource due to a server error.');
        }
    }

    async update(id: string, updatePaisDto: UpdatePaisDto): Promise<PaisEntity> {
        const persistedPais: PaisEntity = await this.paisRepository.findOne({ where: { id } });
        if (!persistedPais) {
            throw new BusinessLogicException("The pais with the given id was not found", HttpStatus.NOT_FOUND);
        }
        
        // Usa el operador de tipo `as` para convertir `updatePaisDto` a `DeepPartial<PaisEntity>`
        const updatedPais = this.paisRepository.merge(persistedPais, updatePaisDto as DeepPartial<PaisEntity>);
        return await this.paisRepository.save(updatedPais);
    }  

    async remove(id: string) {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id}});
        if (!pais)
          throw new BusinessLogicException("The ciudad with the given id was not found", HttpStatus.NOT_FOUND);

        await this.paisRepository.remove(pais);
    }


}

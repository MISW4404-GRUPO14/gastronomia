import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './entities/restaurante.entity';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { BusinessLogicException } from 'src/shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';


@Injectable()
export class RestauranteService {

    private readonly logger = new Logger('RestauranteService');
    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    ) {}

    async findAll() {
        try{
          const restaurantes = this.restauranteRepository.find();
          return restaurantes;
        } catch(error){
          this.logger.error(error)
          throw new InternalServerErrorException('Failed to create resource due to a server error.')
        }
      }

    async findOne(id: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id}, relations: ["pais", "restaurantes"] });
        if (!restaurante)
          throw new BusinessLogicException("The ciudad with the given id was not found", HttpStatus.NOT_FOUND);

        return restaurante;
    }

    async create(createRestauranteDto: CreateRestauranteDto): Promise<RestauranteEntity> {
        try {
            const restaurante = this.restauranteRepository.create(createRestauranteDto as Partial<RestauranteEntity>);
            await this.restauranteRepository.save(restaurante);
            return restaurante;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Failed to create resource due to a server error.');
        }
    }
    

    async update(id: string, updateRestauranteDto: UpdateRestauranteDto): Promise<RestauranteEntity> {
        const persistedRestaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id}});
        if (!persistedRestaurante)
          throw new BusinessLogicException("The ciudad with the given id was not found", HttpStatus.NOT_FOUND);

        const updatedRestaurante = Object.assign(persistedRestaurante, updateRestauranteDto);
        return await this.restauranteRepository.save(updatedRestaurante);
    }

    async remove(id: string) {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id}});
        if (!restaurante)
          throw new BusinessLogicException("The ciudad with the given id was not found", HttpStatus.NOT_FOUND);

        await this.restauranteRepository.remove(restaurante);
    }
}

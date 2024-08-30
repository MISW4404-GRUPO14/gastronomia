import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecetasService {

  private readonly logger = new Logger('RecetasService');

  constructor( 
    @InjectRepository(Receta)
    private readonly recetaRepository: Repository<Receta>
  ){}

  async create(createRecetaDto: CreateRecetaDto) {

    try{
      const recipe = this.recetaRepository.create(createRecetaDto);
      await this.recetaRepository.save( recipe );
      return recipe
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to create resource due to a server error.')
    }
  }

  async findAll() {
    try{
      const recipes = this.recetaRepository.find();
      return recipes;
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to create resource due to a server error.')
    }
  }

  async findOne(id:string) {
   
    const recipe = await this.recetaRepository.findOneBy({ id });
    if(!recipe){
      throw new NotFoundException(`The recipe with the given id ${id} was not found`)
      }
    return recipe;
    
  }

  async update(id: string, updateRecetaDto: UpdateRecetaDto) {

    try{  
      const recipe = await this.recetaRepository.preload({
        id: id,
        ...updateRecetaDto
      })
      if ( !recipe ) throw new NotFoundException(`The recipe with the given id ${id} was not found`)
      await this.recetaRepository.save( recipe );
      return recipe; 
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to update recipe due to a server error.')
    }
  }

  async remove(id: string) {
    const recipe = await this.findOne( id );
    await this.recetaRepository.remove( recipe );
  }
}

import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CulturasService {

  private readonly logger = new Logger('CulturasService');

  constructor( 
    @InjectRepository(Cultura)
    private culturaRepository: Repository<Cultura>
  ){}
  
  async create(createCulturaDto: CreateCulturaDto) {
    try{
      const cultura = this.culturaRepository.create(createCulturaDto);
      await this.culturaRepository.save( cultura );
      return cultura
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to create resource due to a server error.')
    }
    //return 'This action adds a new cultura';
  }

  async findAll() {
    try{
      const culturas = this.culturaRepository.find();
      return culturas;
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to find a resource due to a server error.')
    }
    //return `This action returns all culturas`;
  }

  async findOne(id:string) {
    const cultura = await this.culturaRepository.findOneBy({ id });
    if(!cultura){
      throw new NotFoundException(`The culture with the given id ${id} was not found`)
      }
    return cultura;
    //return `This action returns a #${id} cultura`;
  }

  async update(id:string, updateCulturaDto: UpdateCulturaDto) {
    try{  
      const cultura = await this.culturaRepository.preload({
        id: id,
        ...updateCulturaDto
      })
      if ( !cultura ) throw new NotFoundException(`The culture with the given id ${id} was not found`)
      await this.culturaRepository.save( cultura );
      return cultura; 
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to update culture due to a server error.')
    }
    //return `This action updates a #${id} cultura`;
  }

  async remove(id:string) {
    const cultura = await this.findOne(id)
    if(cultura){
      await this.culturaRepository.remove(cultura)
    }else{
      throw new NotFoundException(`The culture with the given id ${id} was not found`)
    }
    //return `This action removes a #${id} cultura`;
  }
}

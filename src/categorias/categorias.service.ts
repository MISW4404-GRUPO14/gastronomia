import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class CategoriasService {
  constructor( 
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>
  ){}
  create(createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaRepository.save(createCategoriaDto);
  }

  async findAll() : Promise<Categoria[]>{
    return await this.categoriaRepository.find({ relations: ["productos"] });
  }

  async findOne(id: string) {
    const categoria: Categoria = await this.categoriaRepository.findOne({where: {id}, relations: ["productos"] } );
    if (!categoria)
      throw new BusinessLogicException("No existe una categoria con ese id", HttpStatus.NOT_FOUND);

    return categoria;  
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const existeCategoria: Categoria = await this.categoriaRepository.findOne({where:{id}});
    if (!existeCategoria)
      throw new BusinessLogicException("No existe una categoria con ese id", HttpStatus.NOT_FOUND);
   
    updateCategoriaDto.id = id; 
   
    return await this.categoriaRepository.save(updateCategoriaDto);  }

  async remove(id: string) {
    const categoria: Categoria = await this.categoriaRepository.findOne({where:{id}});
    if (!categoria)
      throw new BusinessLogicException("No existe una categoria con ese id", HttpStatus.NOT_FOUND);
 
    throw new BusinessLogicException("The record has been successfully deleted.", HttpStatus.NO_CONTENT);
  }
}

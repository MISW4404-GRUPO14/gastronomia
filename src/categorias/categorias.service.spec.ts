import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CategoriasController } from './categorias.controller';

describe('CategoriasService', () => {
  let service: CategoriasService;
  let repository: Repository<Categoria>;
  let categoriasList: Categoria[];
  let controllers: CategoriasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriasService],
      controllers: [CategoriasController],
    }).compile();

    controllers = module.get<CategoriasController>(CategoriasController);
    service = module.get<CategoriasService>(CategoriasService);
    repository = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    await seedDatabase();

  });
  const seedDatabase = async () => {
    repository.clear();
    categoriasList = [];
    for(let i = 0; i < 5; i++){
        const categoria: Categoria = await repository.save({
          nombre: faker.company.companyName(),
          descripcion: faker.lorem.sentence() 
        })
          categoriasList.push(categoria)
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();    
    expect(controllers).toBeDefined();
    expect(repository).toBeDefined();

  });

  it('findAll retornar todas las categorias', async () => {
    const categorias: Categoria[] = await controllers.findAll();
    expect(categorias).not.toBeNull();
    expect(categorias).toHaveLength(categoriasList.length);
  });

  it('findOne retornar una categoria por id', async () => {
    const primerCategoria: Categoria = categoriasList[0];
    const categoria: Categoria = await controllers.findOne(primerCategoria.id);
    expect(categoria).not.toBeNull();
    expect(categoria.nombre).toEqual(primerCategoria.nombre)
    expect(categoria.descripcion).toEqual(primerCategoria.descripcion)
  });

  it('findOne retorna error si una categoria no existe', async () => {
    await expect(() => controllers.findOne("0")).rejects.toHaveProperty("message","No existe una categoria con ese id")
  });

  it('create retorna una categoria nueva', async () => {
    const categoria: Categoria = {
      id: "",
      nombre: faker.company.companyName(), 
      descripcion: faker.lorem.sentence(), 
      productos: []
    }

    const nuevaCategoria: Categoria = await controllers.create(categoria);
    expect(nuevaCategoria).not.toBeNull();

    const busquedaCategoria: Categoria = await repository.findOne({where: {id: nuevaCategoria.id}})
    expect(busquedaCategoria).not.toBeNull();
    expect(busquedaCategoria.nombre).toEqual(nuevaCategoria.nombre)
    expect(busquedaCategoria.descripcion).toEqual(nuevaCategoria.descripcion)
  });


  it('update retorna una categoria modificada', async () => {
    const categoria: Categoria = categoriasList[0];
    categoria.nombre = "Nombre Modificado";

    const categoriaModificada: Categoria = await controllers.update(categoria.id, categoria);
    expect(categoriaModificada).not.toBeNull();
  
    const busquedaCategoria: Categoria = await repository.findOne({ where: { id: categoria.id } })
    expect(busquedaCategoria).not.toBeNull();
    expect(busquedaCategoria.nombre).toEqual(categoria.nombre)
  });
 
  it('update retorna error si no encuentra la categoria modificar', async () => {
    let categoria: Categoria = categoriasList[0];
    categoria = {
      ...categoria, nombre: "Nombre Modificado"
    }
    await expect(() => controllers.update("0", categoria)).rejects.toHaveProperty("message", "No existe una categoria con ese id")
  });

  it('delete elimina una categoria', async () => {
    const categoria: Categoria = categoriasList[0];
    await controllers.remove(categoria.id);
  
    const eliminarCategoria: Categoria = await repository.findOne({ where: { id: categoria.id } })
    expect(eliminarCategoria).toBeNull();
  });

  it('delete retorna error al elimina una categoria', async () => {
    const categoria: Categoria = categoriasList[0];
    await controllers.remove(categoria.id);
    await expect(() => controllers.remove("0")).rejects.toHaveProperty("message", "No existe una categoria con ese id")
  });
 
});

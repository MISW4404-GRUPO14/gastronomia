import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoriasService', () => {
  let service: CategoriasService;
  let repository: Repository<Categoria>;
  let categoriaRepositoryMock: jest.Mocked<Repository<Categoria>>;
  let categoriasList: Categoria[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        {
          provide: getRepositoryToken(Categoria),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    categoriaRepositoryMock = module.get(getRepositoryToken(Categoria));
    service = module.get<CategoriasService>(CategoriasService);
    repository = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    await seedDatabase();

  });
  const seedDatabase = async () => {
    categoriasList = [];
    for(let i = 0; i < 5; i++){
        const categoria: Categoria = await repository.save({
          nombre: "Categoria 1",
          descripcion: "Descripcion de Categoria" 
        })
          categoriasList.push(categoria)
    }
  }
  it('should be defined', () => {
    expect(service).toBeDefined();    
  });

  
  it('create retorna una categoria nueva', async () => {
    const categoria= {
      id: "",
      nombre: "Nueva Categoria", 
      descripcion: "Descripción nueva categoria", 
      productos: []
    }
    
    categoriaRepositoryMock.create.mockReturnValue(categoria as any);
    categoriaRepositoryMock.save.mockResolvedValue(categoria as any);

    const result = await service.create(categoria);
    expect(result).toEqual(categoria);

  });


  it('findAll retornar todas las categorias', async () => {
    const categorias: Categoria[] = await service.findAll();
    categoriaRepositoryMock.find.mockResolvedValue(categorias);

    expect(categorias).not.toBeNull();
  });

  it('findOne retorna error si una categoria no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message","No existe una categoria con ese id")
  });


  it('update retorna error si no encuentra la categoria modificar', async () => {
    let categoria: Categoria = categoriasList[0];
    categoria = {
      ...categoria, nombre: "Nombre Modificado"
    }
    await expect(() => service.update("0", categoria)).rejects.toHaveProperty("message", "No existe una categoria con ese id")
  });

  it('delete retorna error al elimina una categoria', async () => {
    await expect(() => service.remove("0")).rejects.toHaveProperty("message", "No existe una categoria con ese id")
  });
 
});

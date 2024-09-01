import { Test, TestingModule } from '@nestjs/testing';
import { CulturasService } from './culturas.service';
import { Cultura } from './entities/cultura.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from 'paises/entities/pais.entity';
import { faker } from '@faker-js/faker';

describe('CulturasService', () => {
  let culturaservice: CulturasService;
  let culturaRepository: Repository<Cultura>;
  let culturaRepositoryMock: jest.Mocked<Repository<Cultura>>;
  let culturasList: Cultura[];
  // let paisRepository: Repository<Pais>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturasService,
        {
          provide: getRepositoryToken(Cultura),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        // {
          // provide: getRepositoryToken(Pais),
          // useClass: Repository,
        // },
      ],
    }).compile();

    culturaservice = module.get<CulturasService>(CulturasService);
    culturaRepository = module.get<Repository<Cultura>>(getRepositoryToken(Cultura));
    culturaRepositoryMock = module.get(getRepositoryToken(Cultura));
    // paisRepository = module.get<Repository<Pais>>(getRepositoryToken(Pais));
  });   

  it('should be defined', () => {
    expect(culturaservice).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una cultura', async () => {
      const createCulturaDto = {
        nombre: "Japonesa",
        descripcion:"La gastronomía japonesa es conocida por su equilibrio, frescura y estética. En ella se destacan ingredientes como el pescado crudo (sushi y sashimi), arroz, algas marinas, y una variedad de vegetales y salsas como la soja y el miso. Los platos japoneses tienden a estar elaborados con cuidado, buscando resaltar los sabores naturales de los ingredientes.",
    };
      culturaRepositoryMock.create.mockReturnValue(createCulturaDto as any);
      culturaRepositoryMock.save.mockResolvedValue(createCulturaDto as any);
      const result = await culturaservice.create(createCulturaDto);
      expect(result).toEqual(createCulturaDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las culturas', async () => {
      const culturasMock = [{
        nombre: "Japonesa",
        descripcion: "La gastronomía japonesa es conocida por su equilibrio, frescura y estética. En ella se destacan ingredientes como el pescado crudo (sushi y sashimi), arroz, algas marinas, y una variedad de vegetales y salsas como la soja y el miso. Los platos japoneses tienden a estar elaborados con cuidado, buscando resaltar los sabores naturales de los ingredientes."
      }] as unknown as Cultura[];
      culturaRepositoryMock.find.mockResolvedValue(culturasMock);

      const result = await culturaservice.findAll();
      expect(result).toEqual(culturasMock);
      // expect(culturaRepository.find).toHaveBeenCalledWith({ relations: ['pais'] });
    });
    
  });
  


  // describe('agregarPaisesACultura', () => {
  //   it('debería lanzar NotFoundException si la receta no existe', async () => {
  //     jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(null);
  //     await expect(culturaservice.agregarPaisesACultura('culturaId', ['paisId']))
  //       .rejects
  //       .toHaveProperty("message", `The recipe with the given id was not found`);
  //   });

  //   it('debería lanzar BadRequestException si un pais no existe', async () => {
  //     const recetaMock = new Cultura();
  //     recetaMock.id = 'recetaId';
  //     jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(recetaMock);
  //     jest.spyOn(paisRepository, 'findBy').mockResolvedValueOnce([]);

  //     await expect(culturaservice.agregarPaisesACultura('culturaId', ['paisId']))
  //       .rejects
  //       .toHaveProperty("message", `Alguno de los paises no existe`);
  //   });

  
});

import { Test, TestingModule } from '@nestjs/testing';
import { CulturasService } from './culturas.service';
import { Cultura } from './entities/cultura.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from '../paises/entities/pais.entity';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('CulturasService', () => {
  let culturaservice: CulturasService;
  let culturaRepository: jest.Mocked<Repository<Cultura>>;
  let paisRepository: jest.Mocked<Repository<Pais>>;
  let restauranteRepository: Repository<Restaurante>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturasService,
        {
          provide: getRepositoryToken(Cultura),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Pais),
          useValue: {
            findBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Restaurante),
          useClass: Repository,
        },
      ],
    }).compile();

    culturaservice = module.get<CulturasService>(CulturasService);
    culturaRepository = module.get(getRepositoryToken(Cultura));
    paisRepository = module.get(getRepositoryToken(Pais));
    restauranteRepository = module.get(getRepositoryToken(Restaurante));
  });

  it('should be defined', () => {
    expect(culturaservice).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una cultura', async () => {
      const createCulturaDto = {
        nombre: "Japonesa",
        descripcion: "La gastronomía japonesa es conocida por su equilibrio, frescura y estética. En ella se destacan ingredientes como el pescado crudo (sushi y sashimi), arroz, algas marinas, y una variedad de vegetales y salsas como la soja y el miso. Los platos japoneses tienden a estar elaborados con cuidado, buscando resaltar los sabores naturales de los ingredientes.",
      };
      culturaRepository.create.mockReturnValue(createCulturaDto as any);
      culturaRepository.save.mockResolvedValue(createCulturaDto as any);
      const result = await culturaservice.create(createCulturaDto);
      expect(result).toEqual(createCulturaDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las culturas', async () => {
      const culturasMock = [{
        nombre: "Japonesa",
        descripcion: "La gastronomía japonesa es conocida por su equilibrio, frescura y estética. En ella se destacan ingredientes como el pescado crudo (sushi y sashimi), arroz, algas marinas, y una variedad de vegetales y salsas como la soja y el miso. Los platos japoneses tienden a estar elaborados con cuidado, buscando resaltar los sabores naturales de los ingredientes.",
      }] as unknown as Cultura[];
      culturaRepository.find.mockResolvedValue(culturasMock);

      const result = await culturaservice.findAll();
      expect(result).toEqual(culturasMock);
    });
  });

  describe('update', () => {
    it('debería actualizar una cultura', async () => {
      const updateCulturaDto = {
        nombre: "Japonesa Actualizada",
        descripcion: "Descripción actualizada.",
      };
      const culturaMock = { id: 'culturaId', nombre: 'Japonesa', descripcion: 'Descripción original' } as Cultura;
      const updatedCulturaMock = { id: 'culturaId', ...updateCulturaDto } as Cultura;

      culturaRepository.preload.mockResolvedValue(updatedCulturaMock);
      culturaRepository.save.mockResolvedValue(updatedCulturaMock);

      const result = await culturaservice.update('culturaId', updateCulturaDto);
      expect(result).toEqual(updatedCulturaMock);
    });

    it('debería lanzar NotFoundException al actualizar una cultura que no existe', async () => {
      const updateCulturaDto = {
        nombre: "Japonesa Actualizada",
        descripcion: "Descripción actualizada.",
      };
      culturaRepository.preload.mockResolvedValue(null);

      await expect(culturaservice.update('culturaId', updateCulturaDto))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una cultura', async () => {
      const culturaMock = { id: 'culturaId' } as Cultura;
      culturaRepository.findOneBy.mockResolvedValue(culturaMock);
      culturaRepository.remove.mockResolvedValue(culturaMock);
  
      const result = await culturaservice.remove('culturaId');
      expect(result).toEqual(culturaMock);
    });
  
    it('debería lanzar NotFoundException al eliminar una cultura que no existe', async () => {
      culturaRepository.findOneBy.mockResolvedValue(null);
      await expect(culturaservice.remove('culturaId'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
  

  describe('agregarPaisesACultura', () => {
    it('debería lanzar NotFoundException si la cultura no existe', async () => {
      culturaRepository.findOneBy.mockResolvedValueOnce(null); 
      await expect(culturaservice.agregarPaisesACultura('culturaId', ['paisId']))
        .rejects
        .toHaveProperty("message", `The culture with the given id culturaId was not found`);
    });

    it('debería lanzar BadRequestException si un pais no existe', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.paises = [];
      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock); 
      paisRepository.findBy.mockResolvedValueOnce([]);

      await expect(culturaservice.agregarPaisesACultura('culturaId', ['paisId']))
        .rejects
        .toHaveProperty("message", `Alguno de los paises no existe`);
    });

    it('debería agregar paises a la cultura correctamente', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.paises = [];
      const paisesMock = new Pais();
      paisesMock.id = 'paisId';

      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock);
      paisRepository.findBy.mockResolvedValueOnce([paisesMock]);
      culturaRepository.save.mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.agregarPaisesACultura('culturaId', ['paisId']);
      expect(result.paises).toContainEqual(paisesMock);
    });
  });

  describe('eliminarPaisDeCultura', () => {
    it('debería lanzar NotFoundException si la cultura no existe', async () => {
      culturaRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(culturaservice.eliminarPaisDeCultura('culturaId', 'paisId'))
        .rejects
        .toHaveProperty("message", `The culture with the given id culturaId was not found`);
    });

    it('debería eliminar un pais de una cultura correctamente', async () => {
      const paisesMock = new Pais();
      paisesMock.id = 'paisId';

      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.paises = [paisesMock];

      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock);
      culturaRepository.save.mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.eliminarPaisDeCultura('culturaId', 'paisId');
      expect(result.paises).not.toContainEqual(paisesMock);
    });
  });

  describe('eliminarRestauranteDeCultura', () => {
    it('debería eliminar un restaurante de una cultura', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      const restauranteMock = new Restaurante();
      restauranteMock.id = 'restauranteId';
      culturaMock.restaurantes = [restauranteMock];

      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock);
      culturaRepository.save.mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.eliminarRestauranteDeCultura('culturaId', 'restauranteId');
      expect(result.restaurantes).not.toContainEqual(restauranteMock);
    });

    it('debería manejar la eliminación de un restaurante que no está en la cultura', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      const restauranteMock = new Restaurante();
      restauranteMock.id = 'restauranteId';
      culturaMock.restaurantes = []; 

      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock);
      culturaRepository.save.mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.eliminarRestauranteDeCultura('culturaId', 'restauranteId');
      expect(result.restaurantes).toEqual([]); 
    });
  });
});

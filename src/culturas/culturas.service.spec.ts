import { Test, TestingModule } from '@nestjs/testing';
import { CulturasService } from './culturas.service';
import { Cultura } from './entities/cultura.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from '../paises/entities/pais.entity';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { CreateCulturaDto } from './dto/create-cultura.dto';

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

    it('debería lanzar NotFoundException al crear mal una cultura', async () => {
      const createCulturaDto: CreateCulturaDto = {
        nombre: 'Test Cultura',
        descripcion: ''
      };
      jest.spyOn(culturaRepository, 'save').mockRejectedValue(new Error());

      await expect(culturaservice.create(createCulturaDto)).rejects.toThrow(InternalServerErrorException);
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

    it('debería lanzar NotFoundException al no encontrar ninguna cultura', async () => {
      jest.spyOn(culturaRepository, 'find').mockRejectedValue(new Error());

      await expect(culturaservice.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('debería retornar una cultura con id determinado', async () => {
      const cultura = new Cultura();
      cultura.id = 'uuid';
      jest.spyOn(culturaRepository, 'findOneBy').mockResolvedValue(cultura);

      expect(await culturaservice.findOne('uuid')).toEqual(cultura);
    });

    it('debería lanzar NotFoundException al encontrar una cultura que no existe', async () => {
      jest.spyOn(culturaRepository, 'findOneBy').mockResolvedValue(null);

      await expect(culturaservice.findOne('uuid')).rejects.toThrow(NotFoundException);
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
        .toThrow(NotFoundException);
    });

    it('deberia dar un InternalServerErrorException error', async () => {
      jest.spyOn(culturaRepository, 'preload').mockResolvedValue(new Cultura());
      jest.spyOn(culturaRepository, 'save').mockRejectedValue(new Error());

      await expect(culturaservice.update('uuid', { nombre: 'Updated Cultura' })).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una cultura', async () => {
      const culturaMock = { id: 'culturaId' } as Cultura;
      culturaRepository.findOneBy.mockResolvedValue(culturaMock);
      culturaRepository.remove.mockResolvedValue(culturaMock);
  
      const result = await culturaservice.remove('culturaId');
      expect(result).toEqual(undefined);
    });
  
    it('debería lanzar NotFoundException al eliminar una cultura que no existe', async () => {
      culturaRepository.findOneBy.mockResolvedValue(null);
      await expect(culturaservice.remove('culturaId'))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw NotFoundException if cultura not found', async () => {
      const id = 'uuid';

      jest.spyOn(culturaservice, 'findOne').mockResolvedValue(null);

      await expect(culturaservice.remove(id)).rejects.toThrow(NotFoundException);
      expect(culturaservice.findOne).toHaveBeenCalledWith(id);
    });

    it('deberia dar un Error', async () => {
      const cultura = new Cultura();
      cultura.id = 'uuid';
      jest.spyOn(culturaRepository, 'findOneBy').mockResolvedValue(cultura);
      jest.spyOn(culturaRepository, 'remove').mockRejectedValue(new Error());

      await expect(culturaservice.remove('uuid')).rejects.toThrow(Error);
    });

    it('debería lanzar InternalServerErrorException', async () => {
      const id = 'uuid';
      const cultura = new Cultura();
      cultura.id = id;

      jest.spyOn(culturaservice, 'findOne').mockResolvedValue(cultura);
      jest.spyOn(culturaRepository, 'remove').mockRejectedValue(new Error('Database error'));

      await expect(culturaservice.remove(id)).rejects.toThrow(InternalServerErrorException);
      expect(culturaservice.findOne).toHaveBeenCalledWith(id);
      expect(culturaRepository.remove).toHaveBeenCalledWith(cultura);
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

  describe('actualizarPaisesEnCultura', () => {
    it('debería actualizar países en una cultura', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      const paisMock = new Pais();
      paisMock.id = 'paisId';
  
      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock);
      paisRepository.findBy.mockResolvedValueOnce([paisMock]);
      culturaRepository.save.mockResolvedValueOnce({...culturaMock, paises: [paisMock]});
  
      const result = await culturaservice.actualizarPaisesEnCultura('culturaId', ['paisId']);
      expect(result.paises).toEqual([paisMock]);
    });
  
    it('debería lanzar BusinessLogicException si algunos países no existen', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock);
      paisRepository.findBy.mockResolvedValueOnce([]); 
  
      await expect(culturaservice.actualizarPaisesEnCultura('culturaId', ['paisId']))
        .rejects
        .toThrow(BusinessLogicException); 
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

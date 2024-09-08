import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantesService } from './restaurantes.service';
import { Repository } from 'typeorm';
import { Restaurante } from './entities/restaurante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { HttpStatus } from '@nestjs/common';
import { Cultura } from '../culturas/entities/cultura.entity';
import { In } from 'typeorm';

describe('RestaurantesService', () => {
  let service: RestaurantesService;
  let repository: Repository<Restaurante>;
  let culturaRepository: Repository<Cultura>; // Variable para CulturaRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantesService,
        {
          provide: getRepositoryToken(Restaurante),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Cultura),
          useValue: {
            // Mock functions para CulturaRepository
            find: jest.fn(),
            findOne: jest.fn(),
            findBy: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantesService>(RestaurantesService);
    repository = module.get<Repository<Restaurante>>(getRepositoryToken(Restaurante));
    culturaRepository = module.get<Repository<Cultura>>(getRepositoryToken(Cultura)); // Asignación del mock de CulturaRepository
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a restaurante', async () => {
      const createRestauranteDto: CreateRestauranteDto = {
        nombre: 'Test Restaurante',
        estrellas: 5,
        fechasConsecucionEstrellas: new Date().toISOString(),
      };
      const createdRestaurante = { id: '1', ...createRestauranteDto };
      jest.spyOn(repository, 'create').mockReturnValue(createdRestaurante as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createdRestaurante as any);

      expect(await service.create(createRestauranteDto)).toEqual(createdRestaurante);
    });

    it('should throw an error if creation fails', async () => {
      const createRestauranteDto: CreateRestauranteDto = {
        nombre: 'Test Restaurante',
        estrellas: 5,
        fechasConsecucionEstrellas: new Date().toISOString(), 
      };
      jest.spyOn(repository, 'create').mockReturnValue({} as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Creation failed'));

      await expect(service.create(createRestauranteDto)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAll', () => {
    it('should return an array of restaurantes', async () => {
      const restaurantes = [{ id: '1', nombre: 'Test Restaurante', estrellas: 5, fechasConsecucionEstrellas: new Date().toISOString() }];
      jest.spyOn(repository, 'find').mockResolvedValue(restaurantes as any);

      expect(await service.findAll()).toEqual(restaurantes);
    });

    it('should throw a BusinessLogicException when findAll fails', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Database error'));
  
      await expect(service.findAll()).rejects.toThrow(
        new BusinessLogicException('Error al obtener restaurantes debido a un error del servidor', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('findOne', () => {
    it('should return a restaurante by id', async () => {
      const restaurante = { id: '1', nombre: 'Test Restaurante', estrellas: 5, fechasConsecucionEstrellas: new Date().toISOString() };
      jest.spyOn(repository, 'findOne').mockResolvedValue(restaurante as any);

      expect(await service.findOne('1')).toEqual(restaurante);
    });

    it('should throw an error if restaurante is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(BusinessLogicException);
    });

    it('should throw a BusinessLogicException when findOne does not find a restaurante', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
  
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new BusinessLogicException(`El restaurante con el ID proporcionado no fue encontrado`, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update and return the restaurante', async () => {
      const updateRestauranteDto: UpdateRestauranteDto = {
        nombre: 'Updated Restaurante',
        estrellas: 4,
        fechasConsecucionEstrellas: new Date().toISOString(),
      };
      const updatedRestaurante = { id: '1', ...updateRestauranteDto };
      jest.spyOn(repository, 'preload').mockResolvedValue(updatedRestaurante as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedRestaurante as any);

      expect(await service.update('1', updateRestauranteDto)).toEqual(updatedRestaurante);
    });

    it('should throw a BusinessLogicException when update does not find a restaurante', async () => {
      jest.spyOn(repository, 'preload').mockResolvedValue(null); // Simula que el restaurante no se encuentra
  
      await expect(service.update('invalid-id', {})).rejects.toThrow(
        new BusinessLogicException(`El restaurante con el ID proporcionado no fue encontrado`, HttpStatus.NOT_FOUND),
      );
    });
  
    it('should throw a BusinessLogicException when update fails due to a server error', async () => {
      jest.spyOn(repository, 'preload').mockResolvedValue({ id: '1', nombre: 'Test Restaurante' } as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));
  
      await expect(service.update('1', {})).rejects.toThrow(
        new BusinessLogicException('Error al actualizar el restaurante debido a un error del servidor', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('remove', () => {
    it('should remove a restaurante', async () => {
      const restaurante = { id: '1', nombre: 'Test Restaurante', estrellas: 5, fechasConsecucionEstrellas: new Date().toISOString() };
      jest.spyOn(service, 'findOne').mockResolvedValue(restaurante as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(restaurante as any);

      await expect(service.remove('1')).resolves.not.toThrow();
    });
  });

  // Test for agregarCulturasARestaurante
  describe('agregarCulturasARestaurante', () => {
    it('should add cultures to a restaurant', async () => {
      const restauranteId = '1';
      const culturaIds = ['2', '3'];
      const mockRestaurante = { id: restauranteId, culturas: [] };
      const mockCulturas = [{ id: '2' }, { id: '3' }];

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante as any);
      jest.spyOn(culturaRepository, 'findBy').mockResolvedValue(mockCulturas as any);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockRestaurante, culturas: mockCulturas } as any);

      const result = await service.agregarCulturasARestaurante(restauranteId, culturaIds);
      expect(result).toEqual({ ...mockRestaurante, culturas: mockCulturas });
      expect(service.findOne).toHaveBeenCalledWith(restauranteId);
      expect(culturaRepository.findBy).toHaveBeenCalledWith({ id: In(culturaIds) });
      expect(repository.save).toHaveBeenCalledWith({ ...mockRestaurante, culturas: mockCulturas });
    });

    it('should throw an error if cultures do not exist', async () => {
      const restauranteId = '1';
      const culturaIds = ['999']; // Non-existing cultura ID
      const mockRestaurante = { id: restauranteId, culturas: [] };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante as any);
      jest.spyOn(culturaRepository, 'findBy').mockResolvedValue([] as any); // No culturas found

      await expect(service.agregarCulturasARestaurante(restauranteId, culturaIds))
        .rejects
        .toThrow(new BusinessLogicException('Alguna de las culturas no existe', HttpStatus.NOT_FOUND));
    });
  });

  // Test for obtenerCulturasDeRestaurante
  describe('obtenerCulturasDeRestaurante', () => {
    it('should return cultures of a restaurant', async () => {
      const restauranteId = '1';
      const mockCulturas = [{ id: '2' }, { id: '3' }];
      const mockRestaurante = { id: restauranteId, culturas: mockCulturas };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante as any);

      const result = await service.obtenerCulturasDeRestaurante(restauranteId);
      expect(result).toEqual(mockCulturas);
    });
  });

  // Test for actualizarCulturasEnRestaurante
  describe('actualizarCulturasEnRestaurante', () => {
    it('should update cultures of a restaurant', async () => {
      const restauranteId = '1';
      const culturaIds = ['2', '3'];
      const mockRestaurante = { id: restauranteId, culturas: [] };
      const mockCulturas = [{ id: '2' }, { id: '3' }];

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante as any);
      jest.spyOn(culturaRepository, 'findBy').mockResolvedValue(mockCulturas as any);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockRestaurante, culturas: mockCulturas } as any);

      const result = await service.actualizarCulturasEnRestaurante(restauranteId, culturaIds);
      expect(result).toEqual({ ...mockRestaurante, culturas: mockCulturas });
    });
  });

  // Test for eliminarCulturaDeRestaurante
  describe('eliminarCulturaDeRestaurante', () => {
    it('should remove a culture from a restaurant', async () => {
      const restauranteId = '1';
      const culturaId = '2';
      const mockRestaurante = { id: restauranteId, culturas: [{ id: '2' }, { id: '3' }] };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante as any);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockRestaurante, culturas: [{ id: '3' }] } as any);

      const result = await service.eliminarCulturaDeRestaurante(restauranteId, culturaId);
      expect(result).toEqual({ ...mockRestaurante, culturas: [{ id: '3' }] });
    });
  });

  describe('actualizarCulturasEnRestaurante', () => {
    it('should update cultures with unique values and correct mapping', async () => {
      const restauranteId = '1';
      const culturaIds = ['2', '3'];
      const mockRestaurante = { id: restauranteId, culturas: [{ id: '2' }, { id: '4' }] }; // Culturas existentes
      const mockCulturas = [{ id: '2' }, { id: '3' }]; // Nuevas culturas
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante as any);
      jest.spyOn(culturaRepository, 'findBy').mockResolvedValue(mockCulturas as any);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockRestaurante, culturas: mockCulturas } as any);
  
      const result = await service.actualizarCulturasEnRestaurante(restauranteId, culturaIds);
      expect(result).toEqual({ ...mockRestaurante, culturas: mockCulturas });
      expect(result.culturas).toEqual(mockCulturas); // Verifica que culturas se han actualizado correctamente
    });
  });

  describe('obtenerCulturaDeRestaurante', () => {
    it('should return a specific culture from a restaurant', async () => {
      const restauranteId = '1';
      const culturaId = '2';
      const mockRestaurante = { id: restauranteId, culturas: [{ id: culturaId }] };
      const mockCultura = { id: culturaId };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante as any);
  
      const result = await service.obtenerCulturaDeRestaurante(restauranteId, culturaId);
      expect(result).toEqual(mockCultura);
    });
  
    it('should throw a BusinessLogicException if the restaurant has no cultures', async () => {
      const restauranteId = '1';
      const culturaId = '2';
      const mockRestaurante = { id: restauranteId, culturas: [] };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante as any);
  
      await expect(service.obtenerCulturaDeRestaurante(restauranteId, culturaId))
        .rejects
        .toThrow(new BusinessLogicException('La cultura solicitada no está asociada al restaurante', HttpStatus.NOT_FOUND));
    });
  
    it('should throw a BusinessLogicException if the culture is not found in the restaurant', async () => {
      const restauranteId = '1';
      const culturaId = '999'; // Non-existing culture ID
      const mockRestaurante = { id: restauranteId, culturas: [{ id: '2' }] };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante as any);
  
      await expect(service.obtenerCulturaDeRestaurante(restauranteId, culturaId))
        .rejects
        .toThrow(new BusinessLogicException('La cultura solicitada no está asociada al restaurante', HttpStatus.NOT_FOUND));
    });
  });
  
});

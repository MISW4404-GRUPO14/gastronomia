import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantesService } from './restaurantes.service';
import { Repository } from 'typeorm';
import { Restaurante } from './entities/restaurante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { HttpStatus } from '@nestjs/common';

describe('RestaurantesService', () => {
  let service: RestaurantesService;
  let repository: Repository<Restaurante>;

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
      ],
    }).compile();

    service = module.get<RestaurantesService>(RestaurantesService);
    repository = module.get<Repository<Restaurante>>(getRepositoryToken(Restaurante));
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
        new BusinessLogicException('Failed to get restaurantes due to a server error', HttpStatus.INTERNAL_SERVER_ERROR),
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
        new BusinessLogicException(`The restaurante with the given id was not found`, HttpStatus.NOT_FOUND),
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
        new BusinessLogicException(`The restaurante with the given id was not found`, HttpStatus.NOT_FOUND),
      );
    });
  
    it('should throw a BusinessLogicException when update fails due to a server error', async () => {
      jest.spyOn(repository, 'preload').mockResolvedValue({ id: '1', nombre: 'Test Restaurante' } as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));
  
      await expect(service.update('1', {})).rejects.toThrow(
        new BusinessLogicException('Failed to update restaurant due to a server error.', HttpStatus.INTERNAL_SERVER_ERROR),
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
});

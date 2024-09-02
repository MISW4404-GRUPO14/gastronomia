import { Test, TestingModule } from '@nestjs/testing';
import { CiudadesService } from './ciudades.service';
import { Ciudad } from './entities/ciudad.entity';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('CiudadesService', () => {
  let service: CiudadesService;
  let ciudadRepository: Repository<Ciudad>;
  let restauranteRepository: Repository<Restaurante>;

  const mockCiudad = {
    id: '1',
    nombre: 'Bogotá',
    idPais: '1',
    restaurantes: []
  };

  const createCiudadDto = { nombre: 'Bogotá' };
  const updatedCiudadDto = { nombre: 'Updated City' };

  const mockCiudadRepository = {
    create: jest.fn().mockReturnValue(mockCiudad),
    save: jest.fn().mockResolvedValue(mockCiudad),
    find: jest.fn().mockResolvedValue([mockCiudad]),
    findOne: jest.fn().mockResolvedValue(mockCiudad),
    preload: jest.fn().mockResolvedValue(mockCiudad),
    remove: jest.fn().mockResolvedValue(mockCiudad),
  };

  const mockRestauranteRepository = {
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CiudadesService,
        { provide: getRepositoryToken(Ciudad), useValue: mockCiudadRepository },
        { provide: getRepositoryToken(Restaurante), useValue: mockRestauranteRepository },
      ],
    }).compile();

    service = module.get<CiudadesService>(CiudadesService);
    ciudadRepository = module.get<Repository<Ciudad>>(getRepositoryToken(Ciudad));
    restauranteRepository = module.get<Repository<Restaurante>>(getRepositoryToken(Restaurante));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a ciudad', async () => {
      const result = await service.create(createCiudadDto);
      expect(result).toEqual(mockCiudad);
      expect(ciudadRepository.create).toHaveBeenCalledWith(createCiudadDto);
      expect(ciudadRepository.save).toHaveBeenCalledWith(mockCiudad);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(ciudadRepository, 'save').mockRejectedValue(new Error('Creation failed'));
      await expect(service.create(createCiudadDto)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAll', () => {
    it('should return an array of ciudades', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCiudad]);
      expect(ciudadRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if retrieval fails', async () => {
      jest.spyOn(ciudadRepository, 'find').mockRejectedValue(new Error('Retrieval failed'));
      await expect(service.findAll()).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findOne', () => {
    it('should return a ciudad by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockCiudad);
      expect(ciudadRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw an error if ciudad is not found', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('remove', () => {
    it('should remove a ciudad', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCiudad);
      const result = await service.remove('1');
      expect(result).toEqual(mockCiudad);
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(ciudadRepository.remove).toHaveBeenCalledWith(mockCiudad);
    });

    it('should throw an error if remove fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCiudad);
      jest.spyOn(ciudadRepository, 'remove').mockRejectedValue(new Error('Remove failed'));
      await expect(service.remove('1')).rejects.toThrow(BusinessLogicException);
    });
  });

  // Add more tests here for your service methods
});

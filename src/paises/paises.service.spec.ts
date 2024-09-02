import { Test, TestingModule } from '@nestjs/testing';
import { PaisesService } from './paises.service';
import { Pais } from './entities/pais.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('PaisesService', () => {
  let service: PaisesService;
  let repository: Repository<Pais>;

  const mockPais: Pais = {
    id: '1',
    nombre: 'Colombia',
    ciudades: [], 
    culturas: [] 
  };

  const createPaisDto = { nombre: 'Colombia' };
  const updatedPaisDto = { nombre: 'Updated Country' };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockPais),
    save: jest.fn().mockResolvedValue(mockPais),
    find: jest.fn().mockResolvedValue([mockPais]),
    findOne: jest.fn().mockResolvedValue(mockPais),
    preload: jest.fn().mockResolvedValue(mockPais),
    remove: jest.fn().mockResolvedValue(mockPais),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaisesService,
        { provide: getRepositoryToken(Pais), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<PaisesService>(PaisesService);
    repository = module.get<Repository<Pais>>(getRepositoryToken(Pais));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a pais', async () => {
      const result = await service.create(createPaisDto);
      expect(result).toEqual(mockPais);
      expect(repository.create).toHaveBeenCalledWith(createPaisDto);
      expect(repository.save).toHaveBeenCalledWith(mockPais);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Creation failed'));
      await expect(service.create(createPaisDto)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAll', () => {
    it('should return an array of paises', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockPais]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw an error if retrieval fails', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Retrieval failed'));
      await expect(service.findAll()).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findOne', () => {
    it('should return a pais by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockPais);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw an error if pais is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('update', () => {
    it('should update and return the pais', async () => {
      jest.spyOn(repository, 'preload').mockResolvedValue(mockPais);
      jest.spyOn(repository, 'save').mockResolvedValue(mockPais);

      const result = await service.update('1', updatedPaisDto);
      expect(result).toEqual(mockPais);
      expect(repository.preload).toHaveBeenCalledWith({ id: '1', ...updatedPaisDto });
      expect(repository.save).toHaveBeenCalledWith(mockPais);
    });
    
  });

  describe('remove', () => {
    it('should remove a pais', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPais);
      const result = await service.remove('1');
      expect(result).toEqual(mockPais);
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(repository.remove).toHaveBeenCalledWith(mockPais);
    });

    it('should throw an error if remove fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPais);
      jest.spyOn(repository, 'remove').mockRejectedValue(new Error('Remove failed'));
      await expect(service.remove('1')).rejects.toThrow(BusinessLogicException);
    });
  });
});




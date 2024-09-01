import { Test, TestingModule } from '@nestjs/testing';
import { PaisesController } from './paises.controller';
import { PaisesService } from './paises.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';

describe('PaisesController', () => {
  let controller: PaisesController;
  let service: PaisesService;

  const mockPais = {
    id: 'some-uuid',
    nombre: 'País de Ejemplo',
    // Agrega aquí cualquier otra propiedad relevante de tu entidad Pais
  };

  const mockCreatePaisDto: CreatePaisDto = {
    nombre: 'País de Ejemplo',
    // Agrega aquí cualquier otra propiedad relevante de tu DTO CreatePaisDto
  };

  const mockUpdatePaisDto: UpdatePaisDto = {
    nombre: 'País de Ejemplo Actualizado',
    // Agrega aquí cualquier otra propiedad relevante de tu DTO UpdatePaisDto
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaisesController],
      providers: [
        {
          provide: PaisesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPais),
            findAll: jest.fn().mockResolvedValue([mockPais]),
            findOne: jest.fn().mockResolvedValue(mockPais),
            update: jest.fn().mockResolvedValue(mockPais),
            remove: jest.fn().mockResolvedValue(mockPais),
          },
        },
      ],
    }).compile();

    controller = module.get<PaisesController>(PaisesController);
    service = module.get<PaisesService>(PaisesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pais', async () => {
      expect(await controller.create(mockCreatePaisDto)).toEqual(mockPais);
    });
  });

  describe('findAll', () => {
    it('should return an array of paises', async () => {
      expect(await controller.findAll()).toEqual([mockPais]);
    });
  });

  describe('findOne', () => {
    it('should return a single pais', async () => {
      expect(await controller.findOne('some-uuid')).toEqual(mockPais);
    });
  });

  describe('update', () => {
    it('should update and return the pais', async () => {
      expect(await controller.update('some-uuid', mockUpdatePaisDto)).toEqual(mockPais);
    });
  });

  describe('remove', () => {
    it('should remove the pais', async () => {
      expect(await controller.remove('some-uuid')).toEqual(mockPais);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantesController } from './restaurantes.controller';
import { RestaurantesService } from './restaurantes.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { AgregarCulturasDto } from './dto/agregar-culturas.dto';
import { EliminarCulturaDto } from './dto/eliminar-culturas.dto';
import { Restaurante } from './entities/restaurante.entity';
import { Cultura } from '../culturas/entities/cultura.entity';
import { NotFoundException } from '@nestjs/common';

describe('RestaurantesController', () => {
  let controller: RestaurantesController;
  let service: RestaurantesService;

  const mockRestaurante: Restaurante = {
    id: 'some-uuid',
    nombre: 'Restaurante El Gourmet',
    estrellas: 5,
    fechasConsecucionEstrellas: new Date('2023-01-01'),
    idCiudad: 'some-city-id',
    culturas: [],
  };

  const mockCulturas: Cultura[] = [
    { id: '1', nombre: 'Cultura A' } as any,
    { id: '2', nombre: 'Cultura B' } as any,
  ];

  const mockCreateRestauranteDto: CreateRestauranteDto = {
    nombre: 'Restaurante El Gourmet',
    estrellas: 5,
    fechasConsecucionEstrellas: '2023-01-01',
  };

  const mockUpdateRestauranteDto: UpdateRestauranteDto = {
    nombre: 'Restaurante El Gourmet Actualizado',
    estrellas: 4,
    fechasConsecucionEstrellas: '2023-02-01',
  };

  const mockAgregarCulturasDto: AgregarCulturasDto = {
    culturaIds: ['1', '2'],
  };

  const mockEliminarCulturaDto: EliminarCulturaDto = {
    restauranteId: 'some-uuid',
    culturaId: '1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantesController],
      providers: [
        {
          provide: RestaurantesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockRestaurante),
            findAll: jest.fn().mockResolvedValue([mockRestaurante]),
            findOne: jest.fn().mockResolvedValue(mockRestaurante),
            update: jest.fn().mockResolvedValue(mockRestaurante),
            remove: jest.fn().mockResolvedValue(mockRestaurante),
            agregarCulturasARestaurante: jest.fn().mockResolvedValue({
              ...mockRestaurante,
              culturas: mockCulturas,
            }),
            obtenerCulturasDeRestaurante: jest.fn().mockResolvedValue(mockCulturas),
            actualizarCulturasEnRestaurante: jest.fn().mockResolvedValue({
              ...mockRestaurante,
              culturas: mockCulturas,
            }),
            eliminarCulturaDeRestaurante: jest.fn().mockResolvedValue({
              ...mockRestaurante,
              culturas: mockCulturas.filter(cultura => cultura.id !== '1'),
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantesController>(RestaurantesController);
    service = module.get<RestaurantesService>(RestaurantesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new restaurante', async () => {
      expect(await controller.create(mockCreateRestauranteDto)).toEqual(mockRestaurante);
    });
  });

  describe('findAll', () => {
    it('should return an array of restaurantes', async () => {
      expect(await controller.findAll()).toEqual([mockRestaurante]);
    });
  });

  describe('findOne', () => {
    it('should return a single restaurante', async () => {
      expect(await controller.findOne('some-uuid')).toEqual(mockRestaurante);
    });
  });

  describe('update', () => {
    it('should update and return the restaurante', async () => {
      expect(await controller.update('some-uuid', mockUpdateRestauranteDto)).toEqual(mockRestaurante);
    });
  });

  describe('remove', () => {
    it('should remove the restaurante', async () => {
      expect(await controller.remove('some-uuid')).toEqual(mockRestaurante);
    });
  });

  describe('agregarCulturas', () => {
    it('should add cultures to a restaurante', async () => {
      expect(await controller.agregarCulturas('some-uuid', mockAgregarCulturasDto)).toEqual({
        ...mockRestaurante,
        culturas: mockCulturas,
      });
    });
  });

  describe('obtenerCulturas', () => {
    it('should return cultures of a restaurante', async () => {
      expect(await controller.obtenerCulturas('some-uuid')).toEqual(mockCulturas);
    });
  });

  describe('actualizarCulturas', () => {
    it('should update cultures in a restaurante', async () => {
      expect(await controller.actualizarCulturas('some-uuid', mockAgregarCulturasDto)).toEqual({
        ...mockRestaurante,
        culturas: mockCulturas,
      });
    });
  });

  describe('eliminarCultura', () => {
    it('should remove a culture from a restaurante', async () => {
      expect(await controller.eliminarCultura(mockEliminarCulturaDto)).toEqual({
        ...mockRestaurante,
        culturas: mockCulturas.filter(cultura => cultura.id !== '1'),
      });
    });
  });
});



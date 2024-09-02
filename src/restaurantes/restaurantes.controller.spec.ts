import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantesController } from './restaurantes.controller';
import { RestaurantesService } from './restaurantes.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { Restaurante } from './entities/restaurante.entity';
import { Cultura } from '../culturas/entities/cultura.entity';
import { Ciudad } from '../ciudades/entities/ciudad.entity';

describe('RestaurantesController', () => {
  let controller: RestaurantesController;
  let service: RestaurantesService;

  const mockRestaurante: Restaurante = {
    id: 'some-uuid',
    nombre: 'Restaurante El Gourmet',
    estrellas: 5,
    fechasConsecucionEstrellas: new Date('2023-01-01'),
    idCiudad: 'some-city-id',
    culturas: [], // Asumiendo que no hay culturas asociadas en este caso
  };

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
});


import { Test, TestingModule } from '@nestjs/testing';
import { CiudadesResolver } from './ciudades.resolver';
import { CiudadesService } from './ciudades.service';
import { Ciudad } from './entities/ciudad.entity';

describe('CiudadesResolver', () => {
  let resolver: CiudadesResolver;
  let ciudadesService: CiudadesService;

  const mockCiudad = {
    id: 'ciudadId1',
    nombre: 'Nombre ciudad 1',
    restaurantes: [],
    idPais: 'paisId1'
  };

  const mockCiudadesArray = [

    {
      id: 'ciudadId1',
      nombre: 'Nombre ciudad 1',
      restaurantes: [],
      idPais: 'paisId1'
    },
    {
      id: 'ciudadId2',
      nombre: 'Nombre ciudad 2',
      restaurantes: [],
      idPais: 'paisId1'
    }
  ];

  const mockCiudadesService = {
    findAll: jest.fn().mockResolvedValue(mockCiudadesArray),
    findOne: jest.fn().mockResolvedValue(mockCiudad),
    create: jest.fn().mockResolvedValue(mockCiudad),
    update: jest.fn().mockResolvedValue(mockCiudad),
    remove: jest.fn().mockResolvedValue(mockCiudad),
    asociarRestauranteACiudad: jest.fn().mockResolvedValue(mockCiudad),
    eliminarRestauranteDeCiudad: jest.fn().mockResolvedValue(mockCiudad),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CiudadesResolver,
        {
          provide: CiudadesService,
          useValue: mockCiudadesService
        }
      ],
    }).compile();

    resolver = module.get<CiudadesResolver>(CiudadesResolver);
    ciudadesService = module.get<CiudadesService>(CiudadesService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('addRestauranteToCiudad', () => {
    it('debería agregar un restaurante a una ciudad', async () => {
      const result = await resolver.agregarRestauranteACiudad('ciudadId1', 'restauranteId1');
      expect(result).toEqual(mockCiudad);
      expect(ciudadesService.asociarRestauranteACiudad).toHaveBeenCalledWith('ciudadId1', 'restauranteId1');
    });
  });

  describe('removeRestauranteFromCiudad', () => {
    it('debería remover un restaurante de una ciudad', async () => {
      const result = await resolver.removeRestauranteDeCiudad('ciudadId1', 'restauranteId1');
      expect(result).toEqual(mockCiudad);
      expect(ciudadesService.eliminarRestauranteDeCiudad).toHaveBeenCalledWith('ciudadId1', 'restauranteId1');
    });
  });

});

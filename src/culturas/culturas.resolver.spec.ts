import { Test, TestingModule } from '@nestjs/testing';
import { CulturasResolver } from './culturas.resolver';
import { CulturasService } from './culturas.service';

describe('CulturasResolver', () => {
  let resolver: CulturasResolver;
  let culturasService: CulturasService;

  const mockCultura = {
    id: 'culturaId1',
    nombre: "Nombre cultura 1",
    descripcion:"Descripción cultura 1",
    paises: [],
    restaurantes: [],
    recetas: [],
    productos: [],
  };

  const mockCulturasArray = [
    {
        id: 'culturaId1',
        nombre: "Nombre cultura 1",
        descripcion:"Descripción cultura 1",
        paises: [],
        restaurantes: [],
        recetas: [],
        productos: [],
    },
    {
      id: 'culturaId2',
      nombre: "Nombre cultura 2",
      descripcion:"Descripción cultura 2",
      paises: [],
      restaurantes: [],
      recetas: [],
      productos: [],
    },
  ];

  const mockCulturasService = {
    findAll: jest.fn().mockResolvedValue(mockCulturasArray),
    findOne: jest.fn().mockResolvedValue(mockCultura),
    create: jest.fn().mockResolvedValue(mockCultura),
    update: jest.fn().mockResolvedValue(mockCultura),
    remove: jest.fn().mockResolvedValue(mockCultura),
    agregarRecetaACultura: jest.fn().mockResolvedValue(mockCultura),
    actualizarRecetasEnCultura: jest.fn().mockResolvedValue(mockCultura),
    eliminarRecetaDeCultura: jest.fn().mockResolvedValue(mockCultura),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturasResolver,
        {
          provide: CulturasService, 
          useValue: mockCulturasService
        },
      ],
    }).compile();

    resolver = module.get<CulturasResolver>(CulturasResolver);
    culturasService = module.get<CulturasService>(CulturasService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('addRecetaToCultura', () => {
    it('debería agregar una receta a una cultura', async () => {
      const result = await resolver.agregarRecetasACultura('culturaId1', ['recetaId1']);
      expect(result).toEqual(mockCultura);
      expect(culturasService.agregarRecetaACultura).toHaveBeenCalledWith('culturaId1', ['recetaId1']);
    });
  });

  describe('updateRecetasInCultura', () => {
    it('debería actualizar el listado de recetas en una cultura', async () => {
      const result = await resolver.updateRecetaEnCulturas('culturaId1', ['recetaId1']);
      expect(result).toEqual(mockCultura);
      expect(culturasService.actualizarRecetasEnCultura).toHaveBeenCalledWith('culturaId1', ['recetaId1']);
    });
  });

  describe('removeRecetaFromCultura', () => {
    it('debería remover un receta de una cultura', async () => {
      const result = await resolver.removeRecetaFromCultura('culturaId1', 'recetaId1');
      expect(result).toEqual(mockCultura);
      expect(culturasService.eliminarRecetaDeCultura).toHaveBeenCalledWith('culturaId1', 'recetaId1');
    });
  });

});

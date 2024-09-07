import { Test, TestingModule } from '@nestjs/testing';
import { CulturasController } from './culturas.controller';
import { CulturasService } from './culturas.service';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { AgregarPaisesDto } from './dto/agregar-paises.dto';
import { Response } from 'express';
import { AgregarRecetasDto } from './dto/agregar-receta.dto';
import { Receta } from '../recetas/entities/receta.entity';
import { Cultura } from './entities/cultura.entity';
import { EliminarRecetaDto } from './dto/eliminar-receta.dtos';

const cultura: Cultura = {
  id: 'mock-uuid',
  nombre: 'Cultura Mock',
  descripcion: 'Descripcion Mock',
  paises: [],
  restaurantes: [],
  recetas: [
    {
      id: 'mock-uuid',
      nombre: "Paella española",
      descripcion: "La paella es un tradicional plato español originario de Valencia, famoso por su combinación de sabores mediterráneos. Se elabora con arroz como ingrediente principal, al que se añade una variedad de mariscos como gambas, mejillones y calamares, junto con pollo o conejo, verduras frescas y azafrán, que le da su característico color dorado. Cocinada a fuego lento en una sartén ancha y poco profunda, la paella es un festín que celebra la riqueza culinaria de la región.",
      foto: "https://images.pexels.com/photos/16743486/pexels-photo-16743486/free-photo-of-comida-restaurante-langosta-cocinando.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      proceso: "Preparación de ingredientes: Limpia y corta los mariscos, el pollo (o conejo), y las verduras (pimiento, tomate,judías verdes). Ten listo el caldo de pescado o pollo, y disuelve el azafrán en un poco de caldo caliente.Cocción de carnes: En una paellera con aceite de oliva, dora el pollo o conejo, retíralo y resérvalo. Luego, sofríe los mariscos hasta que estén ligeramente cocidos y también resérvalos. Sofrito: En la misma paellera, añade más aceite si es necesario, sofríe el pimiento, tomate rallado y ajo hasta que estén tiernos. Añadir arroz: Incorpora el arroz al sofrito y mézclalo bien para que absorba los sabores. Añadir caldo y azafrán: Vierte el caldo caliente y el azafrán disuelto. Coloca las carnes y verduras reservadas, distribuyéndolas uniformemente. Cocina a fuego medio-alto hasta que el arroz esté tierno y el caldo se haya absorbido. Cocción final: Añade los mariscos en los últimos minutos de cocción, dejando que se terminen de cocinar sobre el arroz. Deja reposar unos minutos antes de servir.",
      video: "https://www.youtube.com/watch?v=CrMAy18VRg4",
      cultura: new Cultura,
      productos: []
    }
  ]
}

describe('CulturasController', () => {
  let controller: CulturasController;
  let culturaservice: CulturasService;
  let mockResponse: Partial<Response>;

  const culturaServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    agregarPaisesACultura: jest.fn(),
    agregarRecetaACultura: jest.fn(),
    actualizarRecetasEnCultura: jest.fn(),
    obtenerRecetasDeCultura: jest.fn(),
    eliminarRecetaDeCultura: jest.fn()
  };

  beforeEach(async () => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CulturasController],
      providers: [{
        provide: CulturasService,
        useValue: culturaServiceMock}],
    }).compile();
    controller = module.get<CulturasController>(CulturasController);
    culturaservice = module.get<CulturasService>(CulturasService);

    controller = module.get<CulturasController>(CulturasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una cultura', async () => {
      const createCulturaDto = {
        nombre: "Japonesa",
        descripcion:"La gastronomía japonesa es conocida por su equilibrio, frescura y estética. En ella se destacan ingredientes como el pescado crudo (sushi y sashimi), arroz, algas marinas, y una variedad de vegetales y salsas como la soja y el miso. Los platos japoneses tienden a estar elaborados con cuidado, buscando resaltar los sabores naturales de los ingredientes.",
    };
      await controller.create(createCulturaDto);
      expect(culturaservice.create).toHaveBeenCalledWith(createCulturaDto);
    });
  });

  describe('findAll', () => {
    it('debería llamar a CulturaService.findAll', async () => {
      await controller.findAll();
      expect(culturaservice.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería llamar a CulturaService.findOne con el ID correcto', async () => {
      const id = 'uuid';
      await controller.findOne(id);
      expect(culturaservice.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('debería llamar a CulturaService.update con el ID y datos correctos', async () => {
      const id = 'uuid';
      const updateCulturaDto: UpdateCulturaDto = { nombre: 'Cultura Actualizada' };
      await controller.update(id, updateCulturaDto);
      expect(culturaservice.update).toHaveBeenCalledWith(id, updateCulturaDto);
    });
  });

  describe('remove', () => {
    it('debería llamar a CulturaService.remove con el ID correcto', async () => {
      const id = 'uuid';
      jest.spyOn(culturaservice, 'remove').mockResolvedValue(undefined);
      // await controller.remove(id);
      await controller.remove(id, mockResponse as Response);
      expect(culturaservice.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('Agregar pais a una cultura', () => {
    it('debería llamar a agregarPaisesACultura con los datos correctos', async () => {
      const agregarPaisesDto: AgregarPaisesDto = {
        paisIds: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.agregarPaises("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",agregarPaisesDto);
      expect(culturaservice.agregarPaisesACultura).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });

  describe('Agregar receta a cultura', () => {
    it('debería llamar a agregarRecetasACultura con los datos correctos', async () => {
      const agregarProductosDto: AgregarRecetasDto = {
        recetasId: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.agregarRecetas("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",agregarProductosDto);
      expect(culturaservice.agregarRecetaACultura).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });
  
  describe('Actualizar recetas de culturas', () => {
    it('debería llamar a actualizarRecetas con los datos correctos', async () => {
      const agregarProductosDto: AgregarRecetasDto = {
        recetasId: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.actualizarRecetas("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",agregarProductosDto);
      expect(culturaservice.actualizarRecetasEnCultura).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });

  describe('Obtener recetas de culturas', () => {
    it('debería llamar a actualizarRecetas con los datos correctos', async () => {
      const agregarProductosDto: AgregarRecetasDto = {
        recetasId: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.actualizarRecetas("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",agregarProductosDto);
      expect(culturaservice.actualizarRecetasEnCultura).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });

  describe('obtenerRecetasPorCultura', () => {
    it('debe retornar un array de recetas para una cultura dada', async () => {
      jest.spyOn(culturaservice, 'obtenerRecetasDeCultura').mockResolvedValue(cultura);
      const culturas = await controller.obtenerRecetas('mock-uuid');
      expect(culturas).toEqual(cultura);
      expect(culturaservice.obtenerRecetasDeCultura).toHaveBeenCalledWith('mock-uuid');
    });

    describe('eliminarRecetaDeCultura', () => {
      it('debe eliminar una receta de una cultura dada', async () => {
        const recetaMock = new Receta();
        recetaMock.id = 'recetaId';

        const culturaMock = new Cultura();
        culturaMock.id = 'culturaId';
        culturaMock.recetas = [recetaMock];

        const removeRecetaDto: EliminarRecetaDto = { culturaId:'culturaId', recetaId:'recetaId'}
        // Llamada al controlador
        await controller.eliminarReceta(removeRecetaDto);
  
        // Aserciones
        expect(culturaservice.eliminarRecetaDeCultura).toHaveBeenCalledWith('culturaId', 'recetaId');
      });
    });
  });

});

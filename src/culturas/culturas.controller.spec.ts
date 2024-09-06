import { Test, TestingModule } from '@nestjs/testing';
import { CulturasController } from './culturas.controller';
import { CulturasService } from './culturas.service';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { AgregarPaisesDto } from './dto/agregar-paises.dto';
import { Response } from 'express';

describe('CulturasController', () => {
  let controller: CulturasController;
  let culturaservice: CulturasService;
  let mockResponse: Partial<Response>;

  const culturaId = '0e07e82b-0a71-465e-ad13-cdf7c8c16c45';
  const paisId = '0e07e82b-0a71-465e-ad13-cdf7c8c16c40';

  const culturaServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    agregarPaisesACultura: jest.fn(),
    obtenerPaisesDecultura: jest.fn(), 
    actualizarPaisesEnCultura: jest.fn(), 
    eliminarPaisDeCultura: jest.fn()
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
      await controller.findOne(culturaId);
      expect(culturaservice.findOne).toHaveBeenCalledWith(culturaId);
    });
  });

  describe('update', () => {
    it('debería llamar a CulturaService.update con el ID y datos correctos', async () => {
      const updateCulturaDto: UpdateCulturaDto = { nombre: 'Cultura Actualizada' };
      await controller.update(culturaId, updateCulturaDto);
      expect(culturaservice.update).toHaveBeenCalledWith(culturaId, updateCulturaDto);
    });
  });

  describe('remove', () => {
    it('debería llamar a CulturaService.remove con el ID correcto', async () => {
      jest.spyOn(culturaservice, 'remove').mockResolvedValue(undefined);
      await controller.remove(culturaId, mockResponse as Response);
      expect(culturaservice.remove).toHaveBeenCalledWith(culturaId);
    });
  });

//-----------------------------Paises de una cultura---------------------------------------------------//

  describe('Agregar pais a una cultura', () => {
    it('debería llamar a agregarPaisesACultura con los datos correctos', async () => {
      const agregarPaisesDto: AgregarPaisesDto = {
        paisIds: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.agregarPaises(paisId,agregarPaisesDto);
      expect(culturaservice.agregarPaisesACultura).toHaveBeenCalledWith( paisId, ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });

  describe('obtenerPaises', () => {
    it('debería llamar a obtenerPaisesDecultura con el ID correcto', async () => {
      await controller.obtenerPaises(culturaId);
      expect(culturaservice.obtenerPaisesDecultura).toHaveBeenCalledWith(culturaId);
    });
  });

  describe('actualizarPaises', () => {
    it('debería llamar a actualizarPaisesEnCultura con los datos correctos', async () => {
      const agregarPaisesDto: AgregarPaisesDto = {
        paisIds: ['0e07e82b-0a71-465e-ad13-cdf7c8c16c40'],
      };
      await controller.actualizarPais(culturaId, agregarPaisesDto);
      expect(culturaservice.actualizarPaisesEnCultura).toHaveBeenCalledWith(
        culturaId,
        agregarPaisesDto.paisIds,
      );
    });
  });

  describe('eliminarPais', () => {
    it('debería llamar a eliminarPaisDeCultura con los IDs correctos', async () => {
      jest.spyOn(culturaservice, 'eliminarPaisDeCultura').mockResolvedValue(undefined);
      await controller.eliminarPais(culturaId, paisId, mockResponse as Response);
      expect(culturaservice.eliminarPaisDeCultura).toHaveBeenCalledWith(culturaId, paisId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});

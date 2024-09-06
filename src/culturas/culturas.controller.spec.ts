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

  const culturaServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    agregarPaisesACultura: jest.fn(),
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
});

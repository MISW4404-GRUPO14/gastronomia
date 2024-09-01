import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const categoriaServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    agregarProductosAReceta: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    controllers: [ProductosController],
    providers: [
        {
          provide: ProductosService,
          useValue: categoriaServiceMock,
        },
      ],
    }).compile();
    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería llamar a CategoriaService.create con los datos correctos', async () => {
      const createProductoDto: CreateProductoDto = {
        nombre: "Producto 1",
        descripcion:"Descripción Producto",
        historia:"historia Producto",
        idCategoria:"",
        recetas:[],
    };
      await controller.create(createProductoDto);
      expect(service.create).toHaveBeenCalledWith(createProductoDto);
    });
  });

  describe('findAll', () => {
    it('debería llamar a Categoria.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería llamar a Categoria.findOne con el ID correcto', async () => {
      const id = 'uuid';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('debería llamar a Categoria.update con el ID y datos correctos', async () => {
      const id = 'uuid';
      const updateProductoDto:UpdateProductoDto  = { descripcion:"",nombre: 'Receta Actualizada',historia:"", idCategoria:"", recetas:[] };
      await controller.update(id, updateProductoDto);
      expect(service.update).toHaveBeenCalledWith(id, updateProductoDto);
    });
  });

  describe('remove', () => {
    it('debería llamar a Categoria.remove con el ID correcto', async () => {
      const id = 'uuid';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

});

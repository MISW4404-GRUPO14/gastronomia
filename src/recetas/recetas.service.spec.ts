import { Test, TestingModule } from '@nestjs/testing';
import { RecetasService } from './recetas.service';
import { Repository } from 'typeorm';
import { Receta } from './entities/receta.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producto } from '../productos/entities/producto.entity';

describe('RecetasService', () => {
  let recetaService: RecetasService;
  let recetaRepository: Repository<Receta>;
  let recetaRepositoryMock: jest.Mocked<Repository<Receta>>;
  let productoRepository: Repository<Producto>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecetasService,
        {
          provide: getRepositoryToken(Receta),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Producto),
          useClass: Repository,
        },
      ],
    }).compile();

    recetaService = module.get<RecetasService>(RecetasService);
    recetaRepository = module.get<Repository<Receta>>(getRepositoryToken(Receta));
    recetaRepositoryMock = module.get(getRepositoryToken(Receta));
    productoRepository = module.get<Repository<Producto>>(getRepositoryToken(Producto));
  });

  it('should be defined', () => {
    expect(recetaService).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una receta', async () => {
      const createRecetaDto = {
        nombre: "Paella española",
        descripcion:"La paella es un tradicional plato español originario de Valencia, famoso por su combinación de sabores mediterráneos. Se elabora con arroz como ingrediente principal, al que se añade una variedad de mariscos como gambas, mejillones y calamares, junto con pollo o conejo, verduras frescas y azafrán, que le da su característico color dorado. Cocinada a fuego lento en una sartén ancha y poco profunda, la paella es un festín que celebra la riqueza culinaria de la región.",
        foto:"https://images.pexels.com/photos/16743486/pexels-photo-16743486/free-photo-of-comida-restaurante-langosta-cocinando.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        proceso:"Preparación de ingredientes: Limpia y corta los mariscos, el pollo (o conejo), y las verduras (pimiento, tomate,judías verdes). Ten listo el caldo de pescado o pollo, y disuelve el azafrán en un poco de caldo caliente.Cocción de carnes: En una paellera con aceite de oliva, dora el pollo o conejo, retíralo y resérvalo. Luego, sofríe los mariscos hasta que estén ligeramente cocidos y también resérvalos. Sofrito: En la misma paellera, añade más aceite si es necesario, sofríe el pimiento, tomate rallado y ajo hasta que estén tiernos. Añadir arroz: Incorpora el arroz al sofrito y mézclalo bien para que absorba los sabores. Añadir caldo y azafrán: Vierte el caldo caliente y el azafrán disuelto. Coloca las carnes y verduras reservadas, distribuyéndolas uniformemente. Cocina a fuego medio-alto hasta que el arroz esté tierno y el caldo se haya absorbido. Cocción final: Añade los mariscos en los últimos minutos de cocción, dejando que se terminen de cocinar sobre el arroz. Deja reposar unos minutos antes de servir.",
        video: "https://www.youtube.com/watch?v=CrMAy18VRg4"
    };
      recetaRepositoryMock.create.mockReturnValue(createRecetaDto as any);
      recetaRepositoryMock.save.mockResolvedValue(createRecetaDto as any);
      const result = await recetaService.create(createRecetaDto);
      expect(result).toEqual(createRecetaDto);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las recetas', async () => {
      const recetasMock = [{  nombre: "Paella española",
        descripcion:"La paella es un tradicional plato español originario de Valencia, famoso por su combinación de sabores mediterráneos. Se elabora con arroz como ingrediente principal, al que se añade una variedad de mariscos como gambas, mejillones y calamares, junto con pollo o conejo, verduras frescas y azafrán, que le da su característico color dorado. Cocinada a fuego lento en una sartén ancha y poco profunda, la paella es un festín que celebra la riqueza culinaria de la región.",
        foto:"https://images.pexels.com/photos/16743486/pexels-photo-16743486/free-photo-of-comida-restaurante-langosta-cocinando.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        proceso:"Preparación de ingredientes: Limpia y corta los mariscos, el pollo (o conejo), y las verduras (pimiento, tomate,judías verdes). Ten listo el caldo de pescado o pollo, y disuelve el azafrán en un poco de caldo caliente.Cocción de carnes: En una paellera con aceite de oliva, dora el pollo o conejo, retíralo y resérvalo. Luego, sofríe los mariscos hasta que estén ligeramente cocidos y también resérvalos. Sofrito: En la misma paellera, añade más aceite si es necesario, sofríe el pimiento, tomate rallado y ajo hasta que estén tiernos. Añadir arroz: Incorpora el arroz al sofrito y mézclalo bien para que absorba los sabores. Añadir caldo y azafrán: Vierte el caldo caliente y el azafrán disuelto. Coloca las carnes y verduras reservadas, distribuyéndolas uniformemente. Cocina a fuego medio-alto hasta que el arroz esté tierno y el caldo se haya absorbido. Cocción final: Añade los mariscos en los últimos minutos de cocción, dejando que se terminen de cocinar sobre el arroz. Deja reposar unos minutos antes de servir.",
        video: "https://www.youtube.com/watch?v=CrMAy18VRg4" }] as Receta[];
      recetaRepositoryMock.find.mockResolvedValue(recetasMock);

      const result = await recetaService.findAll();
      expect(result).toEqual(recetasMock);
      expect(recetaRepository.find).toHaveBeenCalledWith({ relations: ['productos'] });
    });
  });

  describe('agregarProductosAReceta', () => {
    it('debería lanzar NotFoundException si la receta no existe', async () => {
      jest.spyOn(recetaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(recetaService.agregarProductosAReceta('recetaId', ['productoId']))
        .rejects
        .toHaveProperty("message", `The recipe with the given id was not found`);
    });

    it('debería lanzar BadRequestException si un producto no existe', async () => {
      const recetaMock = new Receta();
      recetaMock.id = 'recetaId';
      jest.spyOn(recetaRepository, 'findOne').mockResolvedValueOnce(recetaMock);
      jest.spyOn(productoRepository, 'findBy').mockResolvedValueOnce([]);

      await expect(recetaService.agregarProductosAReceta('recetaId', ['productoId']))
        .rejects
        .toHaveProperty("message", `Alguno de los productos no existe`);
    });

    it('debería agregar productos a la receta correctamente', async () => {
      const recetaMock = new Receta();
      recetaMock.id = 'recetaId';
      recetaMock.productos = [];
      const productoMock = new Producto();
      productoMock.id = 'productoId';

      jest.spyOn(recetaRepository, 'findOne').mockResolvedValueOnce(recetaMock);
      jest.spyOn(productoRepository, 'findBy').mockResolvedValueOnce([productoMock]);
      jest.spyOn(recetaRepository, 'save').mockResolvedValueOnce(recetaMock);

      const result = await recetaService.agregarProductosAReceta('recetaId', ['productoId']);
      expect(result.productos).toContain(productoMock);
    });

  });

  describe('eliminarProductoDeReceta', () => {
    it('debería lanzar NotFoundException si la receta no existe', async () => {
      jest.spyOn(recetaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(recetaService.eliminarProductoDeReceta('recetaId', 'productoId'))
        .rejects
        .toHaveProperty("message", `The recipe with the given id was not found`);
    });

    it('debería eliminar un producto de una receta correctamente', async () => {
      const productoMock = new Producto();
      productoMock.id = 'productoId';

      const recetaMock = new Receta();
      recetaMock.id = 'recetaId';
      recetaMock.productos = [productoMock];

      jest.spyOn(recetaRepository, 'findOne').mockResolvedValueOnce(recetaMock);
      jest.spyOn(recetaRepository, 'save').mockResolvedValueOnce(recetaMock);

      const result = await recetaService.eliminarProductoDeReceta('recetaId', 'productoId');
      expect(result.productos).not.toContain(productoMock);
    });
  });
  
});
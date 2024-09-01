import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categoria } from '../categorias/entities/categoria.entity';

describe('ProductosService', () => {
  let service: ProductosService;
  let repository: Repository<Producto>;
  let repositoryCategoria: Repository<Categoria>;
  let productoRepositoryMock: jest.Mocked<Repository<Producto>>;
  let categoriaRepositoryMock: jest.Mocked<Repository<Categoria>>;
  let productosList: Producto[];
  let categoriasList: Categoria[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Categoria),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();
    
    service = module.get<ProductosService>(ProductosService);
    repository = module.get<Repository<Producto>>(getRepositoryToken(Producto));
    productoRepositoryMock = module.get(getRepositoryToken(Producto));
    repositoryCategoria = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    categoriaRepositoryMock = module.get(getRepositoryToken(Categoria));
    await seedDatabaseProducto();
    await seedDatabaseCategoria();
  });

  const seedDatabaseProducto = async () => {
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: Producto = await repository.save({
        nombre: "Producto Name", 
        descripcion: "descripcion", 
        historia: "Historia", 
        idCategoria: "categoriaId",
        recetas: []
      });
      productosList.push(producto);
    }
  };

  const seedDatabaseCategoria = async () => {
    categoriasList = [];
    for (let i = 0; i < 5; i++) {
      const categoria: Categoria = await repositoryCategoria.save({
        nombre: "Categoria Name", 
        descripcion: "descripcion"
      });
      categoriasList.push(categoria);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(productoRepositoryMock).toBeDefined();
    expect(repositoryCategoria).toBeDefined();
  });
  
  it('create retorna un producto nuevo', async () => {
    // Crea un mock de producto
    const prodMock = new Producto();
    prodMock.id = 'prodId';
    prodMock.idCategoria = "categoriaId"; 

    jest.spyOn(repositoryCategoria, 'findOne').mockResolvedValueOnce(categoriasList[0]);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(prodMock);

    const producto= {
      id: "",
      nombre: "Producto Name", 
      descripcion: "descripcion", 
      historia: "Historia", 
      idCategoria: null,
      recetas: []
    };
    
    const result = await service.create(producto);
    expect(result).toEqual(prodMock);
    
  });

  it('create un producto con id de categoria erronea', async () => {
    
    const producto: Producto = {
      id: "",
      nombre: "Producto Name", 
      descripcion: "descripcion", 
      historia: "Historia", 
      idCategoria:'0', 
      recetas:[]
    }

    await expect(() => service.create(producto)).rejects.toHaveProperty("message", "La categoría no existe")

  });
  it('findAll retornar todas las categorias', async () => {
    const categorias: Producto[] = await service.findAll();
    expect(categorias).not.toBeNull();
  });

  it('findOne retorna error si un producto no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message","No existe un producto con ese id")
  });


  it('update retorna error si no encuentra la producto modificar', async () => {
    let producto: Producto = productosList[0];
    producto = {
      ...producto, nombre: "Nombre Modificado"
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "No existe un producto con ese id")
  });

  it('delete retorna error al elimina un producto', async () => {
    await expect(() => service.remove("0")).rejects.toHaveProperty("message", "No existe un producto con ese id")
  });
});

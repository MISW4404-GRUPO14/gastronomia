import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Categoria } from '../categorias/entities/categoria.entity';
import { ProductosController } from './productos.controller';

describe('ProductosService', () => {
  let service: ProductosService;
  let repository: Repository<Producto>;
  let repositoryCatetoria: Repository<Categoria>;
  let productosList: Producto[];
  let categoriasList: Categoria[];
  let controllers: ProductosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductosService],
      controllers: [ProductosController],
    }).compile();
    
    controllers = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
    repository = module.get<Repository<Producto>>(getRepositoryToken(Producto));
    repositoryCatetoria = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    await seedDatabaseProducto();
    await seedDatabaseCategoria();

  });
  const seedDatabaseProducto = async () => {
    repository.clear();
    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: Producto = await repository.save({
          nombre: faker.company.companyName(),
          descripcion: faker.lorem.sentence(),
          historia: faker.lorem.sentence(),
        })
          productosList.push(producto)
    }
  }

  const seedDatabaseCategoria = async () => {
    repositoryCatetoria.clear();
    categoriasList = [];
    for(let i = 0; i < 5; i++){
        const categoria: Categoria = await repositoryCatetoria.save({
          nombre: faker.company.companyName(),
          descripcion: faker.lorem.sentence(), 
        })
          categoriasList.push(categoria)
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controllers).toBeDefined();
    expect(repository).toBeDefined();
    expect(repositoryCatetoria).toBeDefined();
  });

  it('findAll retornar todas las categorias', async () => {
    const categorias: Producto[] = await controllers.findAll();
    expect(categorias).not.toBeNull();
    expect(categorias).toHaveLength(productosList.length);
  });

  it('findOne retornar un producto por id', async () => {
    const primerProducto: Producto = productosList[0];
    const producto: Producto = await repository.findOne({where: {id: primerProducto.id}})

    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(primerProducto.nombre)
    expect(producto.descripcion).toEqual(primerProducto.descripcion)
    expect(producto.historia).toEqual(primerProducto.historia)
  });

  it('findOne retorna error si un producto no existe', async () => {
    await expect(() => controllers.findOne("0")).rejects.toHaveProperty("message","No existe un producto con ese id")
  });

  it('create retorna un producto nuevo', async () => {
    
    const primerCategoria: Categoria = categoriasList[0];
    const producto: Producto = {
      id: "",
      nombre: faker.company.companyName(), 
      descripcion: faker.lorem.sentence(), 
      historia: faker.lorem.sentence(), 
      idCategoria:primerCategoria.id, 
      recetas:[],
    }

    const nuevoProducto: Producto = await controllers.create(producto);
    expect(nuevoProducto).not.toBeNull();

    const busquedaCategoria: Producto = await repository.findOne({where: {id: nuevoProducto.id}})
    expect(busquedaCategoria).not.toBeNull();
    expect(busquedaCategoria.nombre).toEqual(nuevoProducto.nombre)
    expect(busquedaCategoria.descripcion).toEqual(nuevoProducto.descripcion)
    expect(busquedaCategoria.historia).toEqual(nuevoProducto.historia)
  });



  it('create un producto con id de categoria erronea', async () => {
    
    const producto: Producto = {
      id: "",
      nombre: faker.company.companyName(), 
      descripcion: faker.lorem.sentence(), 
      historia: faker.lorem.sentence(), 
      idCategoria:'0', 
      recetas:[]
    }

    await expect(() => controllers.create(producto)).rejects.toHaveProperty("message", "La categoría no existe")

  });


  it('update retorna un producto modificado', async () => {
    const producto: Producto = productosList[0];
    const primerCategoria: Categoria = categoriasList[0];

    producto.nombre = "Nombre Modificado";
    producto.idCategoria = primerCategoria.id;
    const categoriaModificada: Producto = await controllers.update(producto.id, producto);
    expect(categoriaModificada).not.toBeNull();
  
    const busquedaCategoria: Producto = await repository.findOne({ where: { id: producto.id } })
    expect(busquedaCategoria).not.toBeNull();
    expect(busquedaCategoria.nombre).toEqual(producto.nombre)
  });
 
  it('update retorna error si no encuentra la producto modificar', async () => {
    let producto: Producto = productosList[0];
    producto = {
      ...producto, nombre: "Nombre Modificado"
    }
    await expect(() => controllers.update("0", producto)).rejects.toHaveProperty("message", "No existe un producto con ese id")
  });

  it('delete elimina un producto', async () => {
    const producto: Producto = productosList[0];
    await controllers.remove(producto.id);
  
    const eliminarCategoria: Producto = await repository.findOne({ where: { id: producto.id } })
    expect(eliminarCategoria).toBeNull();
  });

  it('delete retorna error al elimina un producto', async () => {
    const producto: Producto = productosList[0];
    await controllers.remove(producto.id);
    await expect(() => controllers.remove("0")).rejects.toHaveProperty("message", "No existe un producto con ese id")
  });
});

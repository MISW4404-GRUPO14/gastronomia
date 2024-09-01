import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturasModule } from './culturas/culturas.module';
import { RecetasModule } from './recetas/recetas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { Cultura } from './culturas/entities/cultura.entity';
import { RestaurantesModule } from './restaurantes/restaurantes.module';
import { CiudadesModule } from './ciudades/ciudades.module';
import { PaisesModule } from './paises/paises.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CulturasModule,
    RecetasModule,
    CategoriasModule,
    ProductosModule,
    RestaurantesModule,
    CiudadesModule,
    PaisesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

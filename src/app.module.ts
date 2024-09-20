import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturasModule } from './culturas/culturas.module';
import { RecetasModule } from './recetas/recetas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { RestaurantesModule } from './restaurantes/restaurantes.module';
import { CiudadesModule } from './ciudades/ciudades.module';
import { PaisesModule } from './paises/paises.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () =>({
        store: await redisStore({
          socket: {
            host: process.env.HOST,
            port: +process.env.REDIS_PORT,
          }
        })
      }),
    }),
    CulturasModule,
    RecetasModule,
    CategoriasModule,
    ProductosModule,
    RestaurantesModule,
    CiudadesModule,
    PaisesModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

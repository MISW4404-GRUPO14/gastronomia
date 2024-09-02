import { Res } from '@nestjs/common';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurante } from '../../restaurantes/entities/restaurante.entity';
import { Pais } from '../../paises/entities/pais.entity';

    @Entity()
    export class Cultura {
        @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column('text')
        nombre: String;

        @Column('text')
        descripcion: String;

        @ManyToMany(()=> Restaurante, (restaurante) => restaurante.culturas)
        restaurantes: Restaurante[];
        
        @ManyToMany(()=> Pais, (pais) => pais.culturas)
        paises: Pais[];
    }

import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Receta } from 'src/recetas/entities/receta.entity';
import { Res } from '@nestjs/common';
import { Restaurante } from '../../restaurantes/entities/restaurante.entity';
import { Pais } from 'src/paises/entities/pais.entity';

    @Entity()
    export class Cultura {
        @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column('text')
        nombre: String;

        @Column('text')
        descripcion: String;

    @ManyToMany(()=> Pais, (pais) => pais.culturas)
    paises: Pais[];

    @ManyToMany(()=> Restaurante, (restaurante) => restaurante.culturas)
    restaurantes: Restaurante[];
    
    @OneToMany(() => Receta, (receta) => receta.cultura)
    recetas: Receta[]; 
}
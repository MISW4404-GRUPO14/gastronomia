import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Receta } from '../../recetas/entities/receta.entity';
import { Restaurante } from '../../restaurantes/entities/restaurante.entity';
import { Pais } from '../../paises/entities/pais.entity';

    @Entity()
    export class Cultura {
        @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column('text')
        nombre: string;

        @Column('text')
        descripcion: string;

        @ManyToMany(() => Pais, pais => pais.culturas)
        @JoinTable()
        paises: Pais[];
      
        @ManyToMany(() => Restaurante, (restaurante) => restaurante.culturas)
        @JoinTable()
        restaurantes: Restaurante[];
      
        @OneToMany(() => Receta, receta => receta.cultura)
        recetas: Receta[];
}
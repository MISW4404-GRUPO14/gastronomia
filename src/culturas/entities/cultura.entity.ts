import { PaisEntity } from 'src/pais/entities/pais.entity';
import { RestauranteEntity } from 'src/restaurante/entities/restaurante.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cultura {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: String;

    @Column('text')
    descripcion: String;

    @ManyToMany(()=> PaisEntity, pais => pais.culturas)
    paises: PaisEntity[];

    @ManyToMany(()=> RestauranteEntity, restaurante => restaurante.culturas)
    restaurantes: RestauranteEntity[];
}

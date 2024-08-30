import { PaisEntity } from 'src/pais/entities/pais.entity';
import { RestauranteEntity } from 'src/restaurante/entities/restaurante.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Receta } from 'src/recetas/entities/receta.entity';

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
    
    @OneToMany(() => Receta, receta => receta.cultura)
    recetas: Receta[]; 
}

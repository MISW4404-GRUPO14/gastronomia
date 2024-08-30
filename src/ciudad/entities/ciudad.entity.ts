import { PaisEntity } from 'src/pais/entities/pais.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RestauranteEntity } from 'src/restaurante/entities/restaurante.entity';

@Entity()
export class CiudadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(()=> PaisEntity, pais => pais.ciudades)
    pais: PaisEntity;

    @OneToMany(()=> RestauranteEntity, restaurante => restaurante.ciudad)
    restaurantes: RestauranteEntity[];
}
